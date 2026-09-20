# WinsAble Landing Page — PRD & Change Log

## Original Problem Statement
Enhance the existing WinsAble dark-glass landing page WITHOUT redesigning it. Keep desktop UI, Hero, CTA, appeal modal, typography, colors, glass aesthetic identical. Scoped changes only.

## Stack
React (CRA/craco) + FastAPI + MongoDB. Frontend uses framer-motion, tailwind, shadcn/ui, three.js.

## Implemented (Dec 2025)
1. **Premium interactive background** — React Bits `LiquidEther` (WebGL/three.js) added as a full-screen fixed ambient layer behind all sections (`GlobalBackground.jsx`). pointer-events:none, subtle dark overlay (#050505) + vignette for readability. Device-tiered (mobile/tablet/low-end reduce resolution & intensity), respects prefers-reduced-motion. Mounted only AFTER the intro completes (`active={loaded}`) to avoid competing with the loading sequence.
2. **Recovery Galaxy = visual-only** — removed all click/hover popup/tooltip/hover-pause. Kept rotating orbits, center logo, ambient tilt. Avatars pointer-events:none.
3. **Mobile/Tablet glass hamburger nav** (`Nav.jsx`) — desktop nav now `lg:flex` (>=1024 unchanged); `<1024` shows a glass capsule hamburger + slide-down glass menu + full-screen frosted blur backdrop (React portal to body). Closes on Escape, outside/backdrop click, and link click.
   - Fixed a latent bug: framer-motion's `y` animation overrode the CSS `-translate-x-1/2`, pushing the navbar off-screen right. Re-centered via `inset-x-0 mx-auto` (margin-based, no transform conflict). Now perfectly centered at all widths.
4. **Responsive Recovery Galaxy** — ResizeObserver computes a uniform scale so the outer 780px ring fits within the viewport on phones/tablets (proportional, centered, no clipping/overflow). Desktop (>=1024) unchanged (scale=1).
5. **PreHeroLoading reveal robustness** — timer now runs once via ref (no re-render resets) + App-level fallback (`loaded` after 4.8s).
6. **Backend Resend** — appeal-flow email migrated from raw Resend SDK to Emergent-managed email proxy (httpx). Env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME=WinsAble.

## Verification
testing_agent iteration_1: 100% pass across 390/820/1024/1280 — nav centered, hamburger open/close (Escape/backdrop/link), no horizontal overflow, galaxy scales & stays centered, desktop unchanged, appeal modal opens, galaxy visual-only.

## Notes
- Screenshot tool heavily throttles rAF/timers for this animation-heavy page (intro can appear stuck there); real browsers/testing_agent render fine.

## Backlog / Next
- P2: Consider a static poster/gradient fallback for the background on very low-end devices if analytics show jank.
