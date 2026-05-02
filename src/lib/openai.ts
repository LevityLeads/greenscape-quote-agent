// ============================================================
// OpenAI integration for project visualization rendering
// ============================================================

import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

interface GenerateRenderInput {
  projectTitle: string;
  projectDescription: string;
  projectTypes: string[];
  clientAddress?: string;
}

interface GenerateRenderResult {
  imageBase64: string;
  revised_prompt?: string;
}

export async function generateProjectRender(
  input: GenerateRenderInput,
): Promise<GenerateRenderResult | null> {
  try {
    const client = getClient();

    const projectTypesList = input.projectTypes.join(', ');
    const location = input.clientAddress
      ? `at ${input.clientAddress} in Phoenix, Arizona`
      : 'in a residential Phoenix, Arizona neighborhood';

    const prompt = [
      `Photorealistic architectural rendering of a completed residential landscape project ${location}.`,
      `The project is titled "${input.projectTitle}" and includes: ${projectTypesList}.`,
      `Project details: ${input.projectDescription.substring(0, 500)}`,
      `The scene should be a warm golden-hour perspective view showing the finished outdoor living space.`,
      `Desert-adapted landscaping with mature plants, clean hardscape lines, and warm ambient lighting.`,
      `Professional architectural visualization quality, no people, no text, no watermarks.`,
      `Arizona desert backdrop with clear skies, Sonoran desert aesthetic.`,
    ].join(' ');

    const response = await client.images.generate({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1536x1024',
      quality: 'high',
      output_format: 'png',
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      console.error('[OpenAI] No base64 data in image response');
      return null;
    }

    return {
      imageBase64: b64,
      revised_prompt: undefined,
    };
  } catch (err) {
    console.error('[OpenAI] Failed to generate project render:', err);
    return null;
  }
}
