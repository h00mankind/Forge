export interface Preset {
  id: string;
  label: string;
  prompt: string;
}

export const compositionPresets: Preset[] = [
  { id: "medium-full", label: "Medium-Full Shot", prompt: "medium-full shot, center-framed" },
  { id: "close-up", label: "Close-Up", prompt: "close-up shot, tightly framed on the subject" },
  { id: "extreme-close", label: "Extreme Close-Up", prompt: "extreme close-up, filling the frame" },
  { id: "wide", label: "Wide Shot", prompt: "wide shot, full environment visible" },
  { id: "rule-thirds", label: "Rule of Thirds", prompt: "subject placed on the rule-of-thirds intersection" },
  { id: "symmetrical", label: "Symmetrical", prompt: "perfectly symmetrical composition, centered" },
  { id: "dutch-angle", label: "Dutch Angle", prompt: "tilted Dutch angle for dynamic tension" },
  { id: "over-shoulder", label: "Over the Shoulder", prompt: "over-the-shoulder framing" },
];

export const lightingPresets: Preset[] = [
  { id: "softbox", label: "Even Product", prompt: "three-point softbox setup" },
  { id: "chiaroscuro", label: "Drama / Tension", prompt: "Chiaroscuro lighting with harsh, high contrast" },
  { id: "golden-hour", label: "Warmth / Golden Hour", prompt: "Golden hour backlighting creating long shadows" },
  { id: "neon-rim", label: "Neon / Cyberpunk", prompt: "Neon rim lighting in magenta and cyan" },
  { id: "low-key", label: "Moody / Low-Key", prompt: "Single overhead spotlight, deep shadows" },
];

export const cameraPresets: Preset[] = [
  { id: "gopro", label: "Immersive Action", prompt: "shot on a GoPro, wide-angle distortion" },
  { id: "fujifilm", label: "Authentic Color", prompt: "shot on Fujifilm, natural color science" },
  { id: "disposable", label: "Nostalgic / Raw", prompt: "shot on a disposable camera with flash" },
  { id: "85mm", label: "Shallow DOF / Bokeh", prompt: "85mm lens, f/1.8, shallow depth of field" },
  { id: "wide-angle", label: "Vast Scale", prompt: "wide-angle lens, sweeping panoramic view" },
  { id: "macro", label: "Tiny Details", prompt: "macro lens, extreme close-up" },
  { id: "low-angle", label: "Low Dramatic Angle", prompt: "low-angle shot looking up" },
  { id: "aerial", label: "Bird's Eye", prompt: "aerial view, top-down perspective" },
];

export const colorPresets: Preset[] = [
  { id: "80s-film", label: "Nostalgic / Gritty", prompt: "1980s color film, slightly grainy" },
  { id: "muted-teal", label: "Modern Moody", prompt: "cinematic color grading with muted teal tones" },
  { id: "ektar", label: "Vibrant Pop", prompt: "Kodak Ektar, vivid saturated colors" },
  { id: "polaroid", label: "Faded Vintage", prompt: "washed-out Polaroid tones, light leaks" },
  { id: "bw", label: "B&W Dramatic", prompt: "Ilford HP5 black and white, high contrast" },
];

export type StyleCategoryId =
  | "photography"
  | "illustration"
  | "3d-cgi"
  | "digital-art"
  | "painting"
  | "graphic-design"
  | "cinematic"
  | "experimental";

export interface StyleCategory {
  id: StyleCategoryId;
  label: string;
  styles: Preset[];
}

export const styleCategories: StyleCategory[] = [
  {
    id: "photography",
    label: "Photography",
    styles: [
      { id: "editorial", label: "Editorial", prompt: "editorial photography" },
      { id: "documentary", label: "Documentary", prompt: "documentary photography" },
      { id: "street", label: "Street", prompt: "street photography" },
      { id: "portrait", label: "Portrait", prompt: "portrait photography" },
      { id: "product", label: "Product", prompt: "product photography" },
      { id: "fashion", label: "Fashion", prompt: "fashion photography" },
      { id: "landscape", label: "Landscape", prompt: "landscape photography" },
      { id: "macro", label: "Macro", prompt: "macro photography" },
      { id: "aerial-drone", label: "Aerial / Drone", prompt: "aerial drone photography" },
      { id: "astrophotography", label: "Astrophotography", prompt: "astrophotography, night sky" },
      { id: "film-noir-photo", label: "Film Noir", prompt: "film noir photography, high contrast black and white" },
      { id: "lomography", label: "Lomography", prompt: "lomography, light leaks, vignette, saturated colors" },
      { id: "tintype", label: "Tintype", prompt: "tintype photograph, vintage wet plate process" },
      { id: "infrared", label: "Infrared", prompt: "infrared photography, false color" },
      { id: "cyanotype", label: "Cyanotype", prompt: "cyanotype print, Prussian blue tones" },
    ],
  },
  {
    id: "illustration",
    label: "Illustration",
    styles: [
      { id: "line-art", label: "Line Art", prompt: "line art illustration" },
      { id: "ink-wash", label: "Ink Wash", prompt: "ink wash illustration, fluid gradients" },
      { id: "crosshatch", label: "Crosshatch", prompt: "crosshatch pen illustration" },
      { id: "storybook", label: "Storybook", prompt: "storybook illustration, whimsical and warm" },
      { id: "botanical", label: "Botanical", prompt: "botanical illustration, scientific detail" },
      { id: "technical", label: "Technical", prompt: "technical illustration, precise cutaway diagram" },
      { id: "comic-book", label: "Comic Book", prompt: "comic book illustration, bold outlines, halftone dots" },
      { id: "manga", label: "Manga", prompt: "manga illustration, screentone shading" },
      { id: "concept-art", label: "Concept Art", prompt: "concept art, painterly environment design" },
      { id: "fashion-illust", label: "Fashion Illustration", prompt: "fashion illustration, elongated figures, loose brushwork" },
      { id: "arch-rendering", label: "Architectural Rendering", prompt: "architectural rendering, precise perspective" },
      { id: "ukiyo-e", label: "Ukiyo-e", prompt: "ukiyo-e woodblock print style, flat color areas" },
    ],
  },
  {
    id: "3d-cgi",
    label: "3D / CGI",
    styles: [
      { id: "3d-render", label: "3D Render", prompt: "3D render, physically based materials" },
      { id: "isometric", label: "Isometric", prompt: "isometric 3D render" },
      { id: "clay-render", label: "Clay Render", prompt: "clay render, matte white material, ambient occlusion" },
      { id: "wireframe", label: "Wireframe", prompt: "wireframe 3D render" },
      { id: "unreal-engine", label: "Unreal Engine", prompt: "unreal engine 5 render, ray-traced global illumination" },
      { id: "low-poly", label: "Low-Poly", prompt: "low-poly 3D, flat-shaded triangular faces" },
      { id: "voxel-art", label: "Voxel Art", prompt: "voxel art, blocky 3D pixel style" },
      { id: "photogrammetry", label: "Photogrammetry", prompt: "photogrammetry scan, ultra-realistic geometry" },
      { id: "sss", label: "Subsurface Scattering", prompt: "subsurface scattering, translucent materials" },
      { id: "ray-traced", label: "Ray-Traced", prompt: "ray-traced render, accurate reflections and caustics" },
      { id: "holographic", label: "Holographic", prompt: "holographic display, iridescent translucent projection" },
      { id: "diorama", label: "Diorama", prompt: "miniature diorama, tilt-shift depth of field" },
    ],
  },
  {
    id: "digital-art",
    label: "Digital Art",
    styles: [
      { id: "digital-painting", label: "Digital Painting", prompt: "digital painting, detailed brushwork" },
      { id: "matte-painting", label: "Matte Painting", prompt: "matte painting, cinematic environment" },
      { id: "glitch-art", label: "Glitch Art", prompt: "glitch art, pixel sorting, data corruption aesthetic" },
      { id: "generative-art", label: "Generative Art", prompt: "generative art, algorithmic patterns" },
      { id: "fractal", label: "Fractal", prompt: "fractal art, infinite recursive patterns" },
      { id: "collage", label: "Collage", prompt: "digital collage, mixed media cutouts" },
      { id: "photobash", label: "Photobash", prompt: "photobash, composited photo elements with paintover" },
      { id: "synthwave", label: "Synthwave", prompt: "synthwave aesthetic, neon grid, sunset gradient" },
      { id: "outrun", label: "Outrun", prompt: "outrun style, retro-futuristic neon chrome" },
      { id: "cyberpunk", label: "Cyberpunk", prompt: "cyberpunk aesthetic, neon-lit urban dystopia" },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    styles: [
      { id: "oil-painting", label: "Oil Painting", prompt: "oil painting, rich color depth and glazing" },
      { id: "watercolor", label: "Watercolor", prompt: "watercolor painting, soft washes and bleeds" },
      { id: "acrylic", label: "Acrylic", prompt: "acrylic painting, bold opaque strokes" },
      { id: "gouache", label: "Gouache", prompt: "gouache painting, flat matte finish" },
      { id: "impasto", label: "Impasto", prompt: "impasto, thick textured brushstrokes" },
      { id: "impressionist", label: "Impressionist", prompt: "Impressionist painting, visible brushstrokes, light and color" },
      { id: "expressionist", label: "Expressionist", prompt: "Expressionist painting, emotional distortion" },
      { id: "surrealist", label: "Surrealist", prompt: "Surrealist painting, dreamlike impossible imagery" },
      { id: "pointillist", label: "Pointillist", prompt: "Pointillist, composed of small dots of color" },
      { id: "art-nouveau", label: "Art Nouveau", prompt: "Art Nouveau, organic flowing lines and floral motifs" },
      { id: "baroque", label: "Baroque", prompt: "Baroque painting, dramatic light, rich detail" },
      { id: "renaissance", label: "Renaissance", prompt: "Renaissance painting, classical composition and sfumato" },
      { id: "abstract-expr", label: "Abstract Expressionist", prompt: "Abstract Expressionist, gestural paint and large scale" },
      { id: "ink-and-wash", label: "Ink and Wash", prompt: "Chinese ink and wash painting, monochrome gradients" },
    ],
  },
  {
    id: "graphic-design",
    label: "Graphic Design",
    styles: [
      { id: "vector", label: "Vector", prompt: "vector graphic, clean geometric shapes" },
      { id: "flat-design", label: "Flat Design", prompt: "flat design, minimal shadows, bold color blocks" },
      { id: "risograph", label: "Risograph", prompt: "risograph print, limited color overlap, halftone grain" },
      { id: "screen-print", label: "Screen Print", prompt: "screen print, layered ink on textured paper" },
      { id: "letterpress", label: "Letterpress", prompt: "letterpress, debossed type on thick cotton stock" },
      { id: "swiss-intl", label: "Swiss / International", prompt: "Swiss International Typographic Style, grid-based, Helvetica" },
      { id: "bauhaus", label: "Bauhaus", prompt: "Bauhaus design, primary colors, geometric forms" },
      { id: "pop-art", label: "Pop Art", prompt: "Pop Art, Ben-Day dots, bold outlines, saturated colors" },
      { id: "psychedelic", label: "Psychedelic", prompt: "psychedelic poster, swirling forms, vibrant neon palette" },
      { id: "propaganda-poster", label: "Propaganda Poster", prompt: "propaganda poster, bold type, limited color palette, strong composition" },
    ],
  },
  {
    id: "cinematic",
    label: "Cinematic",
    styles: [
      { id: "cinematic-still", label: "Cinematic Still", prompt: "cinematic film still, widescreen aspect ratio" },
      { id: "film-grain", label: "Film Grain", prompt: "35mm film grain, photochemical texture" },
      { id: "anamorphic", label: "Anamorphic Lens Flare", prompt: "anamorphic lens, horizontal flare streaks, oval bokeh" },
      { id: "technicolor", label: "Technicolor", prompt: "Technicolor three-strip, hyper-saturated vintage Hollywood" },
      { id: "noir", label: "Noir", prompt: "film noir, venetian blind shadows, high contrast black and white" },
      { id: "wes-anderson", label: "Wes Anderson Palette", prompt: "Wes Anderson style, pastel symmetry, centered framing" },
      { id: "blade-runner", label: "Blade Runner Neon", prompt: "Blade Runner aesthetic, rain-soaked neon, dark sci-fi" },
      { id: "kubrick", label: "Kubrick Symmetry", prompt: "Stanley Kubrick style, one-point perspective, cold precision" },
      { id: "tarkovsky", label: "Tarkovsky Muted", prompt: "Tarkovsky style, muted earthy palette, long contemplative shot" },
      { id: "malick", label: "Malick Golden Hour", prompt: "Terrence Malick style, golden hour magic, handheld intimacy" },
    ],
  },
  {
    id: "experimental",
    label: "Experimental",
    styles: [
      { id: "double-exposure", label: "Double Exposure", prompt: "double exposure, two layered transparent images" },
      { id: "long-exposure", label: "Long Exposure", prompt: "long exposure, motion blur, light trails" },
      { id: "tilt-shift", label: "Tilt-Shift", prompt: "tilt-shift, selective focus miniature effect" },
      { id: "solarization", label: "Solarization", prompt: "solarized photograph, inverted midtones" },
      { id: "cross-process", label: "Cross-Process", prompt: "cross-processed film, shifted colors, high saturation" },
      { id: "datamosh", label: "Datamosh", prompt: "datamosh glitch, smeared pixel blocks" },
      { id: "ascii-art", label: "ASCII Art", prompt: "ASCII art, characters forming image" },
      { id: "paper-cutout", label: "Paper Cut-Out", prompt: "paper cut-out collage, layered construction paper" },
    ],
  },
];

export const materialExamples: Preset[] = [
  { id: "tweed", label: "Textured Fabric", prompt: "navy blue tweed with herringbone pattern" },
  { id: "plate-armor", label: "Ornate Metal", prompt: "ornate elven plate armor, etched with silver leaf patterns" },
  { id: "ceramic", label: "Matte Ceramic", prompt: "minimalist ceramic with a matte glaze finish" },
  { id: "leather", label: "Worn Leather", prompt: "distressed brown leather with visible patina and stitching" },
  { id: "glass", label: "Frosted Glass", prompt: "frosted glass with soft light diffusion and beveled edges" },
  { id: "concrete", label: "Raw Concrete", prompt: "raw poured concrete with form-board texture and aggregate visible" },
];
