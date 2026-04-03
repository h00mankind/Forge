# Forge

Forge is a browser-based **structured prompt builder** for image-generation workflows. You fill in composable layers (subject, setting, lighting, style, and more), pick a **purpose** (text-to-image, multimodal, inpainting, style transfer, text rendering), and see the assembled prompt as **labeled text**, **flat text**, or **JSON**—ready to copy or refine.

## What it does

- **Layered builder** — Edit named fields that map to a consistent prompt structure instead of one long textarea.
- **Purpose modes** — Each mode can load a matching template so the same UI adapts to different generator expectations.
- **Style presets** — Browse style categories and sub-styles; optional custom style text.
- **Output formats** — Switch between human-readable labeled output, a single flat string, and structured JSON.
- **Import & helpers** — Paste or import prompt text, random “surprise” fills, and optional AI-assisted generation when an API key is configured in settings.

## Tech stack

| Area | Choice |
|------|--------|
| UI | [React](https://react.dev/) 18 |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build & dev server | [Vite](https://vitejs.dev/) 6 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3, [PostCSS](https://postcss.org/), Autoprefixer |
| Icons | [Lucide React](https://lucide.dev/) |
| Text layout / height estimation | [@chenglou/pretext](https://github.com/chenglou/pretext) (DOM-free measurement for preview sizing) |

Typography is loaded from Google Fonts: **Geist**, **Geist Mono**, and **Instrument Serif**. Theme colors and surfaces use CSS custom properties composed with Tailwind for light/dark-friendly UI.

## Getting started

**Requirements:** Node.js 18+ (or any version compatible with Vite 6).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Production build:**

```bash
npm run build
npm run preview   # optional: serve the dist folder locally
```

## Repository

Source and issues: [github.com/h00mankind/Forge](https://github.com/h00mankind/Forge).
