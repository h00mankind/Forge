import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";

export function detectStyleCategory(styleValue: string): StyleCategoryId | null {
  if (!styleValue.trim()) return null;

  const lower = styleValue.toLowerCase();

  for (const cat of styleCategories) {
    for (const s of cat.styles) {
      if (lower.includes(s.prompt.toLowerCase()) || lower.includes(s.label.toLowerCase())) {
        return cat.id;
      }
    }
  }

  const categoryKeywords: Record<StyleCategoryId, string[]> = {
    photography: ["photo", "photograph", "portrait", "landscape", "editorial", "street", "macro", "drone", "film noir", "lomograph", "infrared", "cyanotype", "tintype"],
    illustration: ["illustration", "line art", "ink wash", "crosshatch", "storybook", "botanical", "comic", "manga", "concept art", "ukiyo-e", "woodblock"],
    "3d-cgi": ["3d", "cgi", "render", "isometric", "wireframe", "unreal engine", "low-poly", "voxel", "ray-traced", "holographic", "diorama", "subsurface"],
    "digital-art": ["digital painting", "matte painting", "glitch", "generative", "fractal", "collage", "photobash", "synthwave", "outrun", "cyberpunk"],
    painting: ["oil painting", "watercolor", "acrylic", "gouache", "impasto", "impressionist", "expressionist", "surrealist", "pointillist", "art nouveau", "baroque", "renaissance", "abstract express", "ink and wash"],
    "graphic-design": ["vector", "flat design", "risograph", "screen print", "letterpress", "swiss", "bauhaus", "pop art", "psychedelic", "propaganda"],
    cinematic: ["cinematic", "film still", "film grain", "anamorphic", "technicolor", "noir", "wes anderson", "blade runner", "kubrick", "tarkovsky", "malick"],
    experimental: ["double exposure", "long exposure", "tilt-shift", "solariz", "cross-process", "datamosh", "ascii", "paper cut"],
  };

  for (const [catId, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return catId as StyleCategoryId;
    }
  }

  return null;
}
