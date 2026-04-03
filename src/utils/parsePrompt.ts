import type { PromptLayers } from "../hooks/usePromptStore";

const LABEL_MAP: Record<string, keyof PromptLayers> = {
  subject: "subject",
  action: "action",
  "action/pose": "action",
  pose: "action",
  setting: "setting",
  location: "setting",
  "location/context": "setting",
  context: "setting",
  environment: "setting",
  composition: "composition",
  framing: "composition",
  lighting: "lighting",
  light: "lighting",
  camera: "camera",
  "camera/lens": "camera",
  lens: "camera",
  color: "color",
  "color/film": "color",
  film: "color",
  "color grading": "color",
  material: "material",
  "material/texture": "material",
  texture: "material",
  style: "style",
  text: "textContent",
};

const JSON_KEY_MAP: Record<string, keyof PromptLayers> = {
  subject: "subject",
  action: "action",
  setting: "setting",
  environment: "setting",
  composition: "composition",
  lighting: "lighting",
  camera: "camera",
  color: "color",
  colorgrading: "color",
  color_grading: "color",
  material: "material",
  texture: "material",
  style: "style",
  text: "textContent",
  textcontent: "textContent",
  text_content: "textContent",
  textfont: "textFont",
  text_font: "textFont",
  font: "textFont",
  textplacement: "textPlacement",
  text_placement: "textPlacement",
  placement: "textPlacement",
};

function flatten(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val && typeof val === "object") {
    return Object.values(val as Record<string, unknown>)
      .map(flatten)
      .filter(Boolean)
      .join(", ");
  }
  return "";
}

function tryParseJSON(input: string): Partial<PromptLayers> | null {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(input);
  } catch {
    return null;
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return null;

  const result: Partial<PromptLayers> = {};
  let matched = false;

  for (const [key, value] of Object.entries(obj)) {
    const normalized = key.toLowerCase().replace(/[\s-]/g, "_");
    const layerKey = JSON_KEY_MAP[normalized];
    if (layerKey) {
      const text = flatten(value);
      if (text) {
        result[layerKey] = text;
        matched = true;
      }
    } else if (normalized === "prompt" && typeof value === "string" && !matched) {
      const labelParsed = tryParseLabeled(value);
      if (labelParsed) {
        Object.assign(result, labelParsed);
        matched = true;
      }
    }
  }

  return matched ? result : null;
}

function tryParseLabeled(input: string): Partial<PromptLayers> | null {
  const regex = /\[([^\]]+)]\s*/g;
  const parts: { label: string; start: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    parts.push({ label: match[1], start: match.index + match[0].length });
  }

  if (parts.length === 0) return null;

  const result: Partial<PromptLayers> = {};
  let matched = false;

  for (let i = 0; i < parts.length; i++) {
    const end = i + 1 < parts.length
      ? input.lastIndexOf("[", parts[i + 1].start)
      : input.length;
    const text = input.slice(parts[i].start, end).trim();
    const normalized = parts[i].label.toLowerCase().trim();
    const layerKey = LABEL_MAP[normalized];

    if (layerKey && text) {
      if (layerKey === "textContent") {
        result.textContent = text.replace(/^"|"$/g, "");
      } else {
        result[layerKey] = text;
      }
      matched = true;
    }
  }

  return matched ? result : null;
}

function parseSentences(input: string): Partial<PromptLayers> {
  const sentences = input
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  if (sentences.length <= 1) {
    return { subject: input.trim() };
  }

  const result: Partial<PromptLayers> = {};
  const fields: (keyof PromptLayers)[] = [
    "subject",
    "action",
    "setting",
    "composition",
    "style",
  ];

  sentences.forEach((sentence, i) => {
    const key = fields[Math.min(i, fields.length - 1)];
    if (result[key]) {
      result[key] += ". " + sentence;
    } else {
      result[key] = sentence;
    }
  });

  return result;
}

export function parsePromptInput(input: string): Partial<PromptLayers> {
  const trimmed = input.trim();
  if (!trimmed) return {};

  const jsonResult = tryParseJSON(trimmed);
  if (jsonResult) return jsonResult;

  const labeledResult = tryParseLabeled(trimmed);
  if (labeledResult) return labeledResult;

  return parseSentences(trimmed);
}
