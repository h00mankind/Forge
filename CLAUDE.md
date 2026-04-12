# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Forge** is a browser-based structured prompt builder for image-generation workflows. Users fill composable layers (subject, action, setting, lighting, style, etc.), pick a purpose type (text-to-image, inpainting, etc.), and export the assembled prompt in labeled text, flat text, or JSON format.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript type-check + Vite production build
npm run preview   # Serve built dist/ locally
```

No test runner or lint scripts are configured. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) is the primary code quality gate — `npm run build` will fail on unused declarations.

## Architecture

### State Management

All app state lives in `src/hooks/usePromptStore.ts` via `useReducer`. There is **no external store** (no Redux, Zustand, etc.). The single state tree has:
- `type` — current prompt purpose
- `layers` — 11 string fields (subject, action, setting, composition, lighting, camera, color, material, style, textContent, textFont, textPlacement)

State is held in `App.tsx` and passed down as props. Actions: `SET_TYPE`, `SET_LAYER`, `APPEND_LAYER`, `LOAD_LAYERS`, `RESET`.

### Layout

Three-column resizable layout managed in `App.tsx`:
- **Left**: `StylePanel` — hierarchical style categories + custom textarea
- **Center**: `BuilderPanel` — 8 `LayerAccordion` inputs + `TextInImageFields`
- **Right**: `PreviewPanel` — purpose picker + output format toggle + live preview

`ResizeHandle` components sit between columns (drag to resize, 200–560px bounds). `CollapsedStrip` renders expand buttons when a panel is hidden. On mobile (<768px) panels stack vertically and resize is disabled.

### Output Assembly

`src/utils/assemblePrompt.ts` contains three pure functions that consume all layers:
- `assembleTextPrompt()` → `[Subject] ...\n[Action] ...` (labeled)
- `assembleFlatPrompt()` → single sentence
- `assembleJSON()` → structured JSON object

### AI Integration

`src/utils/ai.ts` calls OpenRouter directly from the browser. API key + model stored in `localStorage` (managed via `SettingsModal`). `generateCreativePrompt()` uses `response_format: json_object` and returns layer keys matching the state shape.

### Data Layer

- `src/data/presets.ts` — `styleCategories[]` with nested style definitions, plus chip arrays for composition/lighting/camera/color/material
- `src/data/templates.ts` — pre-filled layer defaults per prompt type
- `src/data/stylePlaceholders.ts` — context-aware placeholder text keyed by active style category

### Custom Hooks

- `usePromptStore` — central state + memoized action callbacks
- `useMediaQuery` — responsive breakpoint detection
- `useTextMeasure` — estimates rendered text height using `@chenglou/pretext` (no DOM) with LRU cache (50 entries); used by `PreviewPanel` to size the output box without layout shift

## Styling Conventions

- **All colors** come from CSS custom properties (oklch), never hardcoded Tailwind color names. Light/dark themes are defined in `src/index.css` under `:root` / `.dark`.
- Dark mode uses `darkMode: "class"` — toggled by adding/removing `.dark` on `<html>`.
- Animation tokens (`--duration-fast/base/slow`, `--ease-*`) are defined in `src/index.css` and used for consistent motion. Reduced-motion is respected via `@media (prefers-reduced-motion: reduce)`.
- Path alias `@/*` → `src/*` is configured in both `tsconfig.json` and `vite.config.ts`.
