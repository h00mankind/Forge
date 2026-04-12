import type { PromptLayers, PromptType } from "../hooks/usePromptStore";

type TemplateMap = Record<PromptType, Partial<PromptLayers>>;

export const templates: TemplateMap = {
  "text-to-image": {
    subject:
      "A striking fashion model wearing a tailored brown dress, sleek boots, and holding a structured handbag.",
    action: "Posing with a confident, statuesque stance, slightly turned.",
    setting: "A seamless, deep cherry red studio backdrop.",
    composition: "Medium-full shot, center-framed.",
    style:
      "Fashion magazine editorial, shot on medium-format analog film, pronounced grain, high saturation, cinematic lighting.",
  },
  multimodal: {
    subject: "A high-fidelity 3D armchair render.",
    setting: "A sun-drenched, minimalist living room.",
    material:
      "Using the attached napkin sketch as the structure and the attached fabric sample as the texture.",
  },
  inpainting: {
    subject: "The man in the foreground.",
    action: "Remove the man from the photo and fill with the surrounding background.",
    setting: "Keep the existing background intact.",
  },
  "style-transfer": {
    subject: "This city street photograph.",
    style:
      "Recreate in the style of a Van Gogh oil painting, with thick impasto brushstrokes and swirling sky.",
  },
  "text-rendering": {
    subject: 'A bold urban exploration poster with the text "URBAN EXPLORER".',
    style: "Bold white sans-serif text, centered at the top third.",
    textContent: "URBAN EXPLORER",
    textFont: "bold white sans-serif",
    textPlacement: "centered at the top third",
  },
};

