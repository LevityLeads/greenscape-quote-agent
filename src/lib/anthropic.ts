// ============================================================
// Claude AI integration for proposal generation
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import { AI_MODEL, AI_INPUT_COST_PER_1K, AI_OUTPUT_COST_PER_1K, COMPANY, WARRANTY_TERMS, PAYMENT_TERMS } from './constants';
import type { PricingItem, AIGenerationResult } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `You are an expert landscaping estimator for ${COMPANY.name}, a premium residential landscape and hardscape company based in Phoenix, Arizona. Founded in ${COMPANY.founded}, the company specializes in high-end outdoor living spaces with an average project value of $28,000.

Your role is to interpret site walk notes from the company founder, Marcus Tate, and generate accurate, professional proposals. Marcus often writes quick shorthand notes after walking a property. You need to:

1. Parse vague or abbreviated notes into specific, quantified line items
2. Match items to our pricing database whenever possible
3. Estimate realistic quantities based on Phoenix residential properties (typical lot sizes, common configurations)
4. Think about the full scope: if someone wants a patio, they probably need site prep, a base layer, edging, and possibly grading
5. Consider Phoenix-specific factors: extreme heat, monsoon drainage, HOA requirements, desert-adapted plantings
6. Suggest smart upsells that complement the requested work (lighting for patios, irrigation for new plantings)
7. Flag low-confidence items that Marcus should double-check

Phoenix context you should know:
- Summer temperatures regularly exceed 115F, so shade structures and heat-resistant materials matter
- Monsoon season (July-September) means drainage planning is critical
- Most neighborhoods have HOAs with strict guidelines on materials, colors, and heights
- Desert landscaping (xeriscaping) is standard; lush green lawns are expensive to maintain
- Travertine and natural stone are popular for their heat resistance compared to concrete
- Pool areas are extremely common and often integrate with outdoor living spaces
- Caliche (hardpite calcium carbonate layer) is common in Phoenix soil and increases excavation costs

Pricing approach:
- Always round quantities up slightly (better to over-estimate than under-estimate)
- Include all necessary prep work (demo, grading, haul-off) as separate line items
- Standard AZ transaction privilege tax rate is 8.56%
- Design fees are typically included for projects over $15,000
- Always include permit fees for structural work (pergolas, walls, kitchens)

Output format: You MUST return valid JSON matching this exact structure:
{
  "projectTitle": "string - compelling, descriptive title",
  "projectDescription": "string - 2-3 paragraph professional description of the project vision",
  "scopeOfWork": "string - detailed scope of work with numbered phases",
  "timelineEstimate": "string - realistic timeline with phases",
  "lineItems": [
    {
      "category": "string - must match one of our pricing categories",
      "name": "string - item name",
      "description": "string - brief description of this specific line item",
      "unit": "string - sqft/lnft/each/lump/zone/load",
      "quantity": number,
      "unitPrice": number,
      "lineTotal": number,
      "confidence": number between 0 and 1,
      "notes": "string - any notes for Marcus to review",
      "pricingItemId": "string or null - matching pricing database ID if found"
    }
  ],
  "aiNotes": "string - summary of assumptions made and items needing Marcus's review",
  "suggestedUpsells": ["string array - additional services that would complement this project"]
}

CRITICAL: Return ONLY the JSON object. No markdown, no code fences, no explanation text. Just valid JSON.`;

interface GenerateProposalInput {
  scopeNotes: string;
  projectTypes: string[];
  siteConditions?: string;
  measurements?: string;
  budgetDiscussed?: string;
  timelineExpectation?: string;
  hoaRequired?: boolean;
  clientAddress?: string;
  pricingItems: PricingItem[];
}

export async function generateProposal(input: GenerateProposalInput): Promise<AIGenerationResult> {
  // Build the pricing reference, filtered to relevant categories
  const relevantCategories = mapProjectTypesToCategories(input.projectTypes);
  const relevantPricing = input.pricingItems.filter(
    (item) => item.is_active && (relevantCategories.includes(item.category) || item.category === 'Site Prep' || item.category === 'Miscellaneous'),
  );

  const pricingReference = relevantPricing
    .map((item) => `[${item.id}] ${item.category} | ${item.name} | ${item.description} | ${item.unit} @ $${item.unit_price} | Min: ${item.min_quantity} | Notes: ${item.notes || 'none'}`)
    .join('\n');

  const userPrompt = `Generate a proposal for the following project:

CLIENT LOCATION: ${input.clientAddress || 'Phoenix, AZ area'}
HOA REQUIRED: ${input.hoaRequired ? 'Yes, HOA approval needed' : 'No HOA restrictions'}

PROJECT TYPES SELECTED: ${input.projectTypes.join(', ')}

SITE WALK NOTES FROM MARCUS:
${input.scopeNotes}

${input.siteConditions ? `SITE CONDITIONS: ${input.siteConditions}` : ''}
${input.measurements ? `MEASUREMENTS: ${input.measurements}` : ''}
${input.budgetDiscussed ? `BUDGET DISCUSSED: ${input.budgetDiscussed}` : ''}
${input.timelineExpectation ? `TIMELINE EXPECTATION: ${input.timelineExpectation}` : ''}

PRICING DATABASE (use these prices and IDs where they match):
${pricingReference}

Generate a detailed, professional proposal with accurate line items. Match to pricing database items wherever possible (include the pricingItemId). For items not in the database, use your expertise to price them appropriately for the Phoenix market.

Remember:
- Include all necessary prep and support items (grading, demo, haul-off, etc.)
- Group line items by category
- Flag uncertain quantities with lower confidence scores
- Suggest relevant upsells
- Think about what Marcus might have missed or not mentioned explicitly`;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Calculate cost
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const estimatedCostCents = Math.ceil(
    (inputTokens / 1000) * AI_INPUT_COST_PER_1K * 100 + (outputTokens / 1000) * AI_OUTPUT_COST_PER_1K * 100,
  );

  // Extract the text content
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in AI response');
  }

  // Parse the JSON response
  let parsed: AIGenerationResult;
  try {
    // Try to extract JSON from the response (handle potential markdown wrapping)
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    parsed = JSON.parse(jsonText);
  } catch {
    console.error('[AI] Failed to parse response:', textContent.text.substring(0, 500));
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  // Validate the response structure
  if (!parsed.projectTitle || !parsed.lineItems || !Array.isArray(parsed.lineItems)) {
    throw new Error('AI response missing required fields (projectTitle, lineItems)');
  }

  // Validate and fix line item totals
  parsed.lineItems = parsed.lineItems.map((item) => ({
    ...item,
    lineTotal: Math.round(item.quantity * item.unitPrice * 100) / 100,
    confidence: Math.max(0, Math.min(1, item.confidence || 0.8)),
  }));

  return {
    ...parsed,
    estimatedCostCents,
    modelUsed: AI_MODEL,
    warrantyTerms: WARRANTY_TERMS,
    paymentTerms: PAYMENT_TERMS,
  } as AIGenerationResult;
}

function mapProjectTypesToCategories(projectTypes: string[]): string[] {
  const mapping: Record<string, string[]> = {
    'Patio / Pavers': ['Hardscape'],
    'Pergola / Shade Structure': ['Pergola & Shade'],
    'Fire Pit / Fireplace': ['Hardscape'],
    'Water Feature': ['Water Features'],
    'Artificial Turf': ['Artificial Turf'],
    'Irrigation System': ['Irrigation'],
    'Outdoor Kitchen': ['Outdoor Kitchen'],
    'Retaining Wall': ['Retaining Walls'],
    'Landscape Planting': ['Landscape'],
    'Outdoor Lighting': ['Lighting'],
    'Pool Deck': ['Hardscape'],
    'Driveway': ['Hardscape'],
    'Walkway / Path': ['Hardscape'],
    'Fencing': ['Miscellaneous'],
    'Grading / Site Prep': ['Site Prep'],
  };

  const categories = new Set<string>();
  for (const type of projectTypes) {
    const mapped = mapping[type];
    if (mapped) {
      mapped.forEach((c) => categories.add(c));
    }
  }
  return Array.from(categories);
}
