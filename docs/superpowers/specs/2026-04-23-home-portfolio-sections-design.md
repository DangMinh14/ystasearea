# Home Portfolio Sections Redesign (Design Spec)

## Problem Statement
The Home page sections are currently readable but still feel like static CV blocks. The UX needs stronger storytelling, clearer hierarchy, and more visual engagement while staying professional and consistent with the existing glassmorphism/card-based design system.

## Scope
Redesign these Home page sections only:
- Work Experience (including merged professional background storytelling)
- Technical Skills

Also refine section-level spacing, hierarchy, hover behavior, and reveal behavior to improve perceived depth and scanability.

Out of scope:
- CV Generator tool UI changes
- New backend/data-source integrations

## Goals
1. Turn Work Experience into a timeline-led narrative.
2. Make Technical Skills icon-first and visually structured.
3. Improve hierarchy (Role -> Company -> Highlights -> Secondary details).
4. Keep layout responsive and app-shell-safe.
5. Keep animations subtle and disable them in reduced-motion/PDF-safe modes.

## Approved Design Direction
**Timeline-first portfolio** approach:
- Strong timeline spine and node identity per experience.
- Primary/secondary content split (highlights first, responsibilities collapsed by default).
- Richer skill cards with icon + label + 5-dot proficiency indicator.

## Component Architecture

### 1. `ExperienceTimeline.vue`
Purpose: render Work Experience + professional background storytelling in a single timeline language.

Props:
- `items`: array of experience nodes

Node structure:
- Metadata row: period + role level
- Header row: company identity (avatar/logo placeholder + company name)
- Primary block: key achievements (always visible)
- Secondary block: responsibilities/details (collapsed by default via Show more)
- Footer chips: tech stack + optional metrics chips

### 2. `SkillCardEnhanced.vue`
Purpose: render skill categories as feature cards with icon-led, scannable items.

Props:
- `categoryTitle`
- `skills` (icon, label, level)

Behavior:
- Responsive grid per category
- Fallback icon when category/skill icon is missing
- 5-dot proficiency indicator per skill item

### 3. `HomeView.vue` (updated orchestrator)
- Keeps section ordering, section reveal observer, and data ownership.
- Passes typed props into `ExperienceTimeline` and `SkillCardEnhanced`.
- Maintains app-shell spacing and section wrappers.

## Interaction & UX Behavior
- Timeline cards hover with subtle elevation and minimal scale (~1.02).
- Timeline details are collapsed by default for long content; user can expand per node.
- Scroll reveal remains one-time fade/slide.
- Motion is restrained and professional (no aggressive transforms).
- Keyboard-accessible expand/collapse controls.

## Visual Language
- Reuse current tokens (`--surface-*`, `--border-subtle`, `--accent`, spacing variables).
- Add subtle layered gradients and soft shadows for hierarchy.
- Maintain rounded card styling (2xl feel) without breaking existing UI rhythm.
- Typography emphasis:
  - Role (strong)
  - Company (secondary strong)
  - Highlights (body-medium)
  - Responsibilities (secondary body)

## Responsiveness
- Desktop/tablet: visible timeline spine with clear node connectors.
- Mobile: compact stacked timeline cards with preserved node cue and reduced visual density.
- Skill grid wraps safely with capped columns and even card heights where practical.

## PDF/Reduced-Motion Safety
- In reduced-motion and PDF-safe contexts:
  - Disable reveal animations and hover transforms.
  - Force expanded/static readability where needed.
  - Preserve information hierarchy without interaction dependency.

## Data Model (Home Page Local Data)
- Keep data local in `HomeView` for this iteration.
- Normalize experience nodes into:
  - `id`, `company`, `role`, `period`, `avatar?`, `highlights[]`, `responsibilities[]`, `tags[]`, `metrics[]`
- Normalize skills into:
  - `category`, `items[]` (`icon`, `label`, `level`)

## Error Handling & Fallbacks
- Missing company avatar/logo -> render initials/generic icon node.
- Missing skill icon -> generic fallback icon.
- Empty responsibilities -> hide expand control.
- Excessively long text -> contained layout with optional truncation in collapsed state.

## Verification Strategy
- Validate section hierarchy and spacing across breakpoints.
- Validate expand/collapse accessibility (keyboard + screen reader labels).
- Validate reduced-motion behavior.
- Validate no layout regression with app-shell container and sticky header offsets.
- Validate build remains clean and section content remains readable without animation.

## Implementation Notes
- Keep changes focused to Home page components and related styles.
- Prefer extracting timeline/skill UI into reusable home components.
- Avoid introducing new heavyweight icon dependency (use existing icon system with fallbacks).
