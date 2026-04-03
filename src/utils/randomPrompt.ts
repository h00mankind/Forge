import {
  styleCategories,
  compositionPresets,
  lightingPresets,
  cameraPresets,
  colorPresets,
  materialExamples,
} from "../data/presets";
import type { StyleCategoryId } from "../data/presets";
import { stylePlaceholders } from "../data/stylePlaceholders";
import type { PromptLayers } from "../hooks/usePromptStore";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SUBJECTS = [
  "A weathered lighthouse keeper with a salt-stained beard, standing at the edge of a cliff",
  "A young astronaut floating weightlessly, helmet reflecting Earth below",
  "An ancient oak tree with glowing runes carved into its bark",
  "A cyberpunk street vendor selling holographic fish from a neon-lit cart",
  "A Victorian clockwork automaton sitting at a grand piano",
  "A lone wolf with crystalline fur howling at twin moons",
  "A masked dancer mid-leap, trailing ribbons of light",
  "A child discovering a portal made of stacked library books",
  "A samurai standing in a field of red spider lilies at dusk",
  "A deep-sea diver encountering a bioluminescent jellyfish cathedral",
  "A desert nomad on a mechanical camel crossing vast sand dunes",
  "A witch's cottage overgrown with living, breathing plants",
  "A jazz musician playing saxophone on a rain-soaked rooftop",
  "An android with cracked porcelain skin tending a garden of wires",
  "A giant tortoise carrying a miniature village on its shell",
];

const ACTIONS = [
  "gazing into the distance with quiet determination",
  "mid-stride, caught in a moment of graceful motion",
  "reaching toward a beam of light breaking through storm clouds",
  "sitting in contemplative stillness, eyes closed",
  "turning sharply, coat billowing in the wind",
  "crouching low, examining something hidden in the ground",
  "leaping across a gap, frozen at the apex of the jump",
  "slowly dissolving into particles of golden light",
  "emerging from thick fog, silhouette sharpening",
  "holding an impossibly glowing orb at arm's length",
];

const SETTINGS = [
  "an abandoned Art Deco train station reclaimed by nature",
  "a bioluminescent underwater cave with crystal formations",
  "a rooftop overlooking a sprawling neon-lit megacity at night",
  "a misty bamboo forest with shafts of morning light",
  "the interior of a massive cathedral made entirely of ice",
  "a floating island above the clouds with cascading waterfalls",
  "a dystopian marketplace in perpetual rain",
  "a sun-scorched desert with impossible geometric monoliths",
  "a cozy cabin interior during a snowstorm, firelight flickering",
  "an alien landscape with twin suns and violet vegetation",
];

export interface RandomResult {
  layers: Partial<PromptLayers>;
  categoryId: StyleCategoryId;
}

export function generateRandomPrompt(): RandomResult {
  const category = pick(styleCategories);
  const style = pick(category.styles);
  const placeholders = stylePlaceholders[category.id];

  const usePreset = Math.random() > 0.5;

  return {
    categoryId: category.id,
    layers: {
      subject: pick(SUBJECTS),
      action: pick(ACTIONS),
      setting: pick(SETTINGS),
      composition: usePreset
        ? pick(compositionPresets).prompt
        : placeholders.composition,
      lighting: usePreset
        ? pick(lightingPresets).prompt
        : placeholders.lighting,
      camera: usePreset
        ? pick(cameraPresets).prompt
        : placeholders.camera,
      color: usePreset
        ? pick(colorPresets).prompt
        : placeholders.color,
      material: pick(materialExamples).prompt,
      style: style.prompt,
    },
  };
}
