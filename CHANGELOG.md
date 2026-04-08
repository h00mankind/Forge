# Changelog

All notable changes to Forge are documented in this file.

## [1.1.0] - 2026-04-08

### Added

- **`useMediaQuery` hook** — `matchMedia`-based breakpoint helper for layout decisions without duplicating media logic in CSS-only form.
- **Motion tokens** — Shared duration (`--duration-fast`, `--duration-base`, `--duration-slow`) and `--ease-smooth` curves; refined default `--ease-out`.
- **Enter animations** — `app-shell`, `panel-enter`, and `panel-enter-delayed` for shell and column mount; `reveal-in` for header branding; `shell-in`, `panel-in`, and `reveal-in` keyframes.
- **Interactive surfaces** — `surface-lift` (hover lift / active press) and `micro-glow` (subtle accent glow on hover/focus) applied across header actions, toggles, chips, modals, and related controls.

### Changed

- **Responsive layout** — Below the `md` breakpoint, Style / Builder / Preview stack vertically with borders and flex behavior tuned for small viewports; resizable column widths apply only on desktop (`min-width: 768px`).
- **Stagger lists** — Slightly stronger initial offset and timing aligned with new duration tokens.
- **Toasts** — Stacked appearance with depth (translate/scale/opacity by stack index), smoother motion via `--ease-smooth`, and refined `toast-in` keyframe.

### Fixed

- **Preview / panels** — `min-h-0` and flex fixes so scroll regions behave correctly in the stacked mobile layout.
