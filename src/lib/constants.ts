// ============================================================
// Greenscape Pro QuoteBot - Constants
// ============================================================

export const COMPANY = {
  name: 'Greenscape Pro',
  tagline: 'Premium Landscape & Hardscape Design',
  location: 'Phoenix, AZ',
  phone: '(480) 555-0147',
  email: 'info@greenscapepro.com',
  website: 'https://greenscapepro.com',
  license: 'ROC #298451',
  founded: 2012,
} as const;

export const TAX_RATE = 0.0856; // Arizona TPT rate

export const WARRANTY_TERMS = `All hardscape installations carry a 5-year structural warranty covering settling, shifting, and material defects under normal use. Landscape plantings are guaranteed for 1 year from installation with proper irrigation maintenance. Lighting fixtures and irrigation components carry manufacturer warranty plus 2 years of labor coverage. Warranty does not cover damage from acts of nature, improper maintenance, or unauthorized modifications.`;

export const PAYMENT_TERMS = `50% deposit required to schedule project start date. 40% due at rough completion (hardscape and major structures installed). Final 10% due upon project completion and walkthrough approval. All payments due within 7 days of invoice. Accepted: check, ACH, credit card (3% processing fee applies to credit card payments over $5,000).`;

export const AI_MODEL = 'claude-sonnet-4-20250514';
export const AI_MODEL_DISPLAY = 'Claude Sonnet 4';

// Approximate cost per 1K tokens for Claude Sonnet
export const AI_INPUT_COST_PER_1K = 0.003;
export const AI_OUTPUT_COST_PER_1K = 0.015;

export const PRICING_CATEGORIES = [
  'Hardscape',
  'Landscape',
  'Water Features',
  'Lighting',
  'Irrigation',
  'Outdoor Kitchen',
  'Pergola & Shade',
  'Artificial Turf',
  'Retaining Walls',
  'Site Prep',
  'Miscellaneous',
] as const;
