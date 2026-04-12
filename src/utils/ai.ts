import type { PromptLayers } from "../hooks/usePromptStore";
import type { StyleCategoryId } from "../data/presets";

const STORAGE_KEY = "ai-config";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface AIConfig {
  apiKey: string;
  model: string;
}

export function getAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore parse errors */ }
  return { apiKey: "", model: "" };
}

export function setAIConfig(config: AIConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function hasAPIKey(): boolean {
  return getAIConfig().apiKey.trim().length > 0;
}

const LAYER_KEYS_DESCRIPTION = `
The JSON must contain ONLY these keys (all optional strings):
- subject: the main subject of the image
- action: what the subject is doing, their pose
- setting: environment, location, background
- composition: framing, camera angle, shot type
- lighting: how the scene is lit
- camera: camera model, lens, focal length, aperture
- color: color grading, film stock, palette
- material: physical textures and surfaces visible
- style: artistic style keywords
- textContent: any text that should appear in the image
- textFont: font style for the text
- textPlacement: where the text goes in the image
`.trim();

type Message = {
  role: string;
  content: string | Array<Record<string, unknown>>;
};

async function callOpenRouter(messages: Message[], signal?: AbortSignal): Promise<string> {
  const config = getAIConfig();
  if (!config.apiKey.trim()) {
    throw new Error("No API key configured. Open Settings to add your OpenRouter key.");
  }
  if (!config.model.trim()) {
    throw new Error("No model configured. Open Settings to set a model name.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Prompt Architect",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("Invalid API key. Check your OpenRouter key in Settings.");
    if (res.status === 429) throw new Error("Rate limited. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("Insufficient credits on your OpenRouter account.");
    throw new Error(`API error (${res.status}): ${body.slice(0, 200) || res.statusText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI model.");
  return content;
}

const VALID_LAYER_KEYS = new Set<string>([
  "subject", "action", "setting", "composition", "lighting",
  "camera", "color", "material", "style",
  "textContent", "textFont", "textPlacement",
]);

function extractLayers(raw: string): Partial<PromptLayers> {
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  const parsed = JSON.parse(cleaned);
  if (typeof parsed !== "object" || parsed === null) return {};

  const result: Partial<PromptLayers> = {};
  for (const [key, val] of Object.entries(parsed)) {
    if (VALID_LAYER_KEYS.has(key) && typeof val === "string" && val.trim()) {
      (result as Record<string, string>)[key] = val.trim();
    }
  }
  return result;
}

export async function parsePromptWithAI(
  text: string,
  signal?: AbortSignal
): Promise<Partial<PromptLayers>> {
  const content = await callOpenRouter(
    [
      {
        role: "system",
        content: `You are an expert image generation prompt analyst. Given a text prompt, break it down into structured layers. Respond ONLY with a valid JSON object.\n\n${LAYER_KEYS_DESCRIPTION}\n\nOmit any keys that have no relevant content. Do not add explanations.`,
      },
      {
        role: "user",
        content: `Analyze and break down this image generation prompt into structured layers:\n\n${text}`,
      },
    ],
    signal
  );
  return extractLayers(content);
}

export async function extractPromptFromImage(
  base64: string,
  mimeType: string,
  signal?: AbortSignal
): Promise<Partial<PromptLayers>> {
  const content = await callOpenRouter(
    [
      {
        role: "system",
        content: `You are an expert at analyzing images and describing them as detailed image generation prompts. Given an image, describe it as a structured prompt that could recreate it. Respond ONLY with a valid JSON object.\n\n${LAYER_KEYS_DESCRIPTION}\n\nBe specific and detailed. Omit any keys that are not applicable.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and extract a detailed, structured image generation prompt that could recreate it.",
          },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
        ],
      },
    ],
    signal
  );
  return extractLayers(content);
}

interface AIGenerateResult {
  layers: Partial<PromptLayers>;
  categoryId?: StyleCategoryId;
}

const VALID_CATEGORIES: StyleCategoryId[] = [
  "photography", "illustration", "3d-cgi", "digital-art",
  "painting", "graphic-design", "cinematic", "experimental",
];

export async function generateCreativePrompt(
  styleHint?: string | null,
  signal?: AbortSignal
): Promise<AIGenerateResult> {
  const styleInstruction = styleHint
    ? `The prompt should be in the "${styleHint}" style category.`
    : "Choose any creative style you find interesting.";

  const content = await callOpenRouter(
    [
      {
        role: "system",
        content: `You are a wildly creative image generation prompt writer. Invent a unique, vivid, and detailed image generation prompt. ${styleInstruction}\n\nRespond ONLY with a valid JSON object containing these fields:\n\n${LAYER_KEYS_DESCRIPTION}\n\nAlso include a "categoryId" field with one of: photography, illustration, 3d-cgi, digital-art, painting, graphic-design, cinematic, experimental.\n\nBe imaginative and specific. Fill in as many layers as possible.`,
      },
      {
        role: "user",
        content: "Generate a creative and unique image generation prompt. Surprise me with something visually stunning.",
      },
    ],
    signal
  );

  const raw = content.trim();
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const cleaned = fenceMatch ? fenceMatch[1].trim() : raw;
  const parsed = JSON.parse(cleaned);

  const categoryId = VALID_CATEGORIES.includes(parsed.categoryId)
    ? (parsed.categoryId as StyleCategoryId)
    : undefined;

  delete parsed.categoryId;
  const layers = extractLayers(JSON.stringify(parsed));

  return { layers, categoryId };
}
