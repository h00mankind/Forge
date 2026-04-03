import type { StyleCategoryId } from "./presets";

type LayerKey =
  | "subject"
  | "action"
  | "setting"
  | "composition"
  | "lighting"
  | "camera"
  | "color"
  | "material";

export const stylePlaceholders: Record<StyleCategoryId, Record<LayerKey, string>> = {
  photography: {
    subject: "A fashion model in a tailored brown dress, sleek boots, structured handbag...",
    action: "Posing with a confident stance, slightly turned toward camera...",
    setting: "A seamless cherry red studio backdrop with soft gradient...",
    composition: "Medium-full shot, center-framed, rule of thirds...",
    lighting: "Three-point softbox setup, warm key light from upper-left...",
    camera: "85mm lens, f/1.8, shallow depth of field, shot on Fujifilm...",
    color: "Kodak Ektar vivid saturated colors, warm midtones...",
    material: "Soft washed denim, visible woven fabric texture...",
  },
  illustration: {
    subject: "A young adventurer with a leather satchel and goggles...",
    action: "Peering over a crumbling stone wall into a hidden garden...",
    setting: "An overgrown Victorian greenhouse with broken glass panes...",
    composition: "Full scene, slightly elevated bird's-eye angle...",
    lighting: "Dappled sunlight filtering through leaves, rim-lit dust motes...",
    camera: "Flat perspective, no lens distortion, slight vignette...",
    color: "Warm autumnal palette, muted greens and amber tones...",
    material: "Rough canvas texture visible through the paint layers...",
  },
  "3d-cgi": {
    subject: "A futuristic mech robot with articulated joints and weathered armor...",
    action: "Standing in a battle-ready pose, one arm raised with energy weapon...",
    setting: "A neon-lit cyberpunk cityscape with rain-slicked streets...",
    composition: "Low-angle hero shot, dynamic perspective...",
    lighting: "HDRI environment lighting, orange rim lights, volumetric fog...",
    camera: "Orthographic projection, eye-level, 50mm equivalent...",
    color: "Cool teal and warm orange complementary palette...",
    material: "Brushed titanium with anodized accents, carbon fiber panels...",
  },
  "digital-art": {
    subject: "A lone astronaut drifting above a fracturing planet...",
    action: "Reaching toward a pulsing orb of light...",
    setting: "Deep space with nebula clouds and debris field...",
    composition: "Centered subject, vast negative space, golden spiral...",
    lighting: "Single harsh light source from the orb, deep shadows...",
    camera: "Wide-angle, slight fish-eye distortion at edges...",
    color: "Vibrant neon against deep black, chromatic aberration...",
    material: "Reflective visor surface, worn fabric space suit...",
  },
  painting: {
    subject: "A woman in a flowing white dress sitting in a sun-drenched garden...",
    action: "Reading a book with one hand resting on a cat in her lap...",
    setting: "A misty lakeside at dawn with willow trees...",
    composition: "Slightly off-center, classical triangular composition...",
    lighting: "Diffused northern light from a large window, soft shadows...",
    camera: "Slightly elevated viewpoint, centered, no lens distortion...",
    color: "Warm earth tones with cool blue shadows, limited palette...",
    material: "Thick impasto brushstrokes on canvas, visible texture...",
  },
  "graphic-design": {
    subject: 'Bold typographic lockup with the word "FUTURE"...',
    action: "Static composition, no movement implied...",
    setting: "Abstract geometric background with overlapping shapes...",
    composition: "Grid-based layout, strong vertical rhythm, ample whitespace...",
    lighting: "Flat, no directional lighting, even color fields...",
    camera: "Flat orthographic, no perspective, no depth of field...",
    color: "Limited 3-color risograph palette: coral, navy, cream...",
    material: "Textured recycled paper stock, visible fiber grain...",
  },
  cinematic: {
    subject: "A weary detective in a trench coat, cigarette smoke curling...",
    action: "Walking alone down a rain-slicked alley, pausing under a streetlamp...",
    setting: "A 1940s noir city street, neon signs reflecting in puddles...",
    composition: "Widescreen 2.39:1 aspect ratio, deep staging, leading lines...",
    lighting: "High-contrast venetian blind shadows, single tungsten key light...",
    camera: "Anamorphic lens, 40mm, oval bokeh, horizontal lens flares...",
    color: "Desaturated teal shadows, warm amber highlights, crushed blacks...",
    material: "Wet cobblestone, worn wool fabric, chrome and glass...",
  },
  experimental: {
    subject: "A human silhouette dissolving into particles of light...",
    action: "Mid-transformation, caught between two states of being...",
    setting: "Abstract void, no defined horizon, infinite depth...",
    composition: "Centered, radial symmetry emanating from the figure...",
    lighting: "Self-luminous subject, no external light source...",
    camera: "Long exposure with intentional camera movement...",
    color: "Solarized inverted tones, unexpected color shifts...",
    material: "Glitched pixel texture, data-corrupted surfaces...",
  },
};

export const defaultPlaceholders: Record<LayerKey, string> = {
  subject: "A striking fashion model wearing a tailored brown dress...",
  action: "Posing with a confident, statuesque stance, slightly turned...",
  setting: "A seamless, deep cherry red studio backdrop...",
  composition: "Medium-full shot, center-framed...",
  lighting: "Three-point softbox setup, warm key light...",
  camera: "85mm lens, f/1.8, shallow depth of field...",
  color: "Cinematic color grading with muted teal tones...",
  material: "Navy blue tweed suit jacket with herringbone pattern...",
};
