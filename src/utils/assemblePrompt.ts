import type { PromptLayers, PromptType } from "../hooks/usePromptStore";

interface LayerDef {
  key: keyof PromptLayers;
  label: string;
}

const LAYER_ORDER: LayerDef[] = [
  { key: "subject", label: "Subject" },
  { key: "action", label: "Action" },
  { key: "setting", label: "Setting" },
  { key: "composition", label: "Composition" },
  { key: "lighting", label: "Lighting" },
  { key: "camera", label: "Camera/Lens" },
  { key: "color", label: "Color/Film" },
  { key: "material", label: "Material/Texture" },
  { key: "style", label: "Style" },
];

export function assembleTextPrompt(
  layers: PromptLayers,
  _type: PromptType
): string {
  const parts: string[] = [];

  for (const { key, label } of LAYER_ORDER) {
    const value = layers[key];
    if (value.trim()) {
      parts.push(`[${label}] ${value.trim()}`);
    }
  }

  if (layers.textContent.trim()) {
    let textPart = `[Text] "${layers.textContent.trim()}"`;
    if (layers.textFont.trim()) textPart += `, ${layers.textFont.trim()}`;
    if (layers.textPlacement.trim())
      textPart += `, ${layers.textPlacement.trim()}`;
    parts.push(textPart);
  }

  return parts.join("\n");
}

export function assembleFlatPrompt(
  layers: PromptLayers,
  _type: PromptType
): string {
  const parts: string[] = [];

  for (const { key } of LAYER_ORDER) {
    const value = layers[key];
    if (value.trim()) parts.push(value.trim());
  }

  if (layers.textContent.trim()) {
    let textPart = `"${layers.textContent.trim()}"`;
    if (layers.textFont.trim()) textPart += ` in ${layers.textFont.trim()}`;
    if (layers.textPlacement.trim())
      textPart += `, ${layers.textPlacement.trim()}`;
    parts.push(textPart);
  }

  return parts.join(". ") + (parts.length ? "." : "");
}

export function assembleJSON(
  layers: PromptLayers,
  type: PromptType
): Record<string, unknown> {
  const json: Record<string, unknown> = {
    prompt: assembleFlatPrompt(layers, type),
    promptType: type,
  };

  if (layers.subject || layers.action) {
    json.subject = {
      ...(layers.subject && { description: layers.subject }),
      ...(layers.action && { action: layers.action }),
    };
  }
  if (layers.setting) {
    json.environment = { setting: layers.setting };
  }
  if (layers.composition) {
    json.composition = layers.composition;
  }
  if (layers.lighting) {
    json.lighting = { setup: layers.lighting };
  }
  if (layers.camera) {
    json.camera = { setup: layers.camera };
  }
  if (layers.color) {
    json.colorGrading = layers.color;
  }
  if (layers.material) {
    json.material = layers.material;
  }
  if (layers.style) {
    json.style = { primary: layers.style };
  }
  if (layers.textContent) {
    json.textInImage = {
      content: layers.textContent,
      ...(layers.textFont && { font: layers.textFont }),
      ...(layers.textPlacement && { placement: layers.textPlacement }),
    };
  }

  return json;
}

export function filledLayerCount(layers: PromptLayers): number {
  return LAYER_ORDER.filter((l) => layers[l.key].trim().length > 0).length +
    (layers.textContent.trim().length > 0 ? 1 : 0);
}

export const TOTAL_LAYERS = LAYER_ORDER.length + 1;
