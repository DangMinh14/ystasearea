# Home Fade-In Transition Upgrade (Design Spec)

## Problem Statement
Home sections currently appear too quickly and feel abrupt. The reveal effect lacks depth, sequencing, and visual storytelling.

## Scope
Update Home page reveal behavior to feel smoother and more premium while staying professional.

In scope:
- `src/views/HomeView.vue` reveal orchestration and section animation classes.
- Staged reveal sequence for section header and child blocks.
- Timing/easing upgrades for fade-in motion.
- Preserve one-time reveal behavior.

Out of scope:
- Content changes.
- New sections/components.
- Data model changes.

## Goals
1. Remove “immediate pop-in” feel.
2. Make reveals layered: section shell first, inner elements next.
3. Keep motion subtle and responsive.
4. Preserve reduced-motion accessibility.

## Approved Approach
Use a **hybrid staged reveal**:
- Keep a one-time `IntersectionObserver`.
- Add a 2-step state per section:
  - `is-entering` (pre-reveal setup)
  - `is-visible` (full reveal trigger)
- Drive child staggering via CSS variables and index-based delay classes.

## Architecture & Data Flow
### `HomeView.vue`
- Keep existing section refs and one-time observer.
- On intersection:
  1. mark section as entering,
  2. queue visibility transition with a short pre-delay,
  3. unobserve section.
- Expose reveal classes per section state.
- Add helper class hooks for:
  - section header reveal,
  - container reveal,
  - child stagger reveal.

### CSS Token Strategy
Use section-scoped motion tokens:
- `--reveal-section-duration: 650ms`
- `--reveal-item-duration: 480ms`
- `--reveal-stagger-step: 70ms`
- easing: `cubic-bezier(0.22, 1, 0.36, 1)`

Child reveal pattern:
- Header: first.
- Main card/grid block: second.
- Children inside block: staggered by index.

## Motion Spec
### Section Shell
- From: `opacity: 0; transform: translateY(24px) scale(0.985); filter: blur(8px);`
- To: `opacity: 1; transform: translateY(0) scale(1); filter: blur(0);`

### Inner Elements
- Header uses shorter delay than content.
- Content cards/items use incremental delays based on index.
- Keep movement under current professional thresholds (no bounce, no aggressive scale).

## Responsiveness & Accessibility
- Mobile keeps same reveal logic with reduced transform distance.
- `prefers-reduced-motion` and `print`:
  - disable blur/transform transitions,
  - render content fully visible.

## Error Handling / Safety
- If `IntersectionObserver` is unavailable: reveal all sections immediately.
- If refs are missing: skip observation for missing element without breaking others.
- Avoid JS animation libraries; rely on CSS transitions for predictable behavior.

## Verification Strategy
- Confirm each section now reveals progressively, not instantly.
- Confirm header appears before body content.
- Confirm stagger is visible but not slow.
- Confirm no hover regression and no layout shift.
- Run existing repo checks:
  - `npm test`
  - `npm run build`
