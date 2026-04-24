# Home Fade-In Transition Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Home section reveal transitions so content appears progressively with a premium layered fade-in instead of immediate pop-in.

**Architecture:** Keep the current one-time `IntersectionObserver` in `HomeView.vue`, but split section reveal into two states (`entering` then `visible`) and expose explicit child reveal hooks in template markup. Implement motion using CSS-only transitions with staged delays (header first, content second, children staggered) and keep reduced-motion/print modes fully flattened.

**Tech Stack:** Vue 3, TypeScript, scoped CSS, Vitest, Vue Test Utils, Vite.

---

## File Structure

- **Modify:** `src\views\HomeView.vue`
  - Add staged reveal state and tiny pre-delay logic.
  - Add reveal hook classes/attributes for section header, content container, and child stagger items.
  - Replace basic fade-in styles with layered section + child transitions.
- **Modify:** `src\views\__tests__\HomeViewPortfolioSections.spec.ts`
  - Add assertions for staged reveal classes and child reveal hooks.
  - Add deterministic observer mock setup so visibility state is testable.

---

### Task 1: Add failing tests for staged reveal behavior

**Files:**
- Modify: `src\views\__tests__\HomeViewPortfolioSections.spec.ts`
- Test: `src\views\__tests__\HomeViewPortfolioSections.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('applies staged reveal classes and child hooks for progressive transitions', () => {
  const wrapper = mount(HomeView, {
    global: {
      provide: {
        [appShellContextKey]: createShellContext(),
      },
      stubs: {
        RouterLink: true,
      },
    },
  })

  const workSection = wrapper.get('[data-testid="home-section-work"]')
  expect(workSection.classes()).toContain('home-view__section')
  expect(workSection.classes()).toContain('home-view__section--entering')
  expect(workSection.classes()).toContain('home-view__section--visible')

  expect(wrapper.get('[data-testid="home-section-work-header"]').classes()).toContain('home-view__reveal-header')
  expect(wrapper.get('[data-testid="home-section-work-content"]').classes()).toContain('home-view__reveal-content')
  expect(wrapper.get('[data-testid="home-section-skills-grid"]').classes()).toContain('home-view__reveal-stagger')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:runtime -- src/views/__tests__/HomeViewPortfolioSections.spec.ts`
Expected: FAIL because the new reveal classes/test IDs are not in `HomeView.vue` yet.

- [ ] **Step 3: Commit test changes**

```bash
git add src/views/__tests__/HomeViewPortfolioSections.spec.ts
git commit -m "test(home): cover staged reveal class hooks"
```

---

### Task 2: Implement staged section state (`entering` -> `visible`)

**Files:**
- Modify: `src\views\HomeView.vue`
- Test: `src\views\__tests__\HomeViewPortfolioSections.spec.ts`

- [ ] **Step 1: Add dual reveal state and scheduler in script**

```ts
type RevealPhase = 'hidden' | 'entering' | 'visible'

const sectionPhase = ref<Record<HomeSectionId, RevealPhase>>({
  work: 'hidden',
  portfolio: 'hidden',
  skills: 'hidden',
  education: 'hidden',
  social: 'hidden',
})

const revealTimers = new Map<HomeSectionId, number>()

const revealSection = (id: HomeSectionId) => {
  if (sectionPhase.value[id] !== 'hidden') return
  sectionPhase.value[id] = 'entering'
  const timer = window.setTimeout(() => {
    sectionPhase.value[id] = 'visible'
    revealTimers.delete(id)
  }, 70)
  revealTimers.set(id, timer)
}
```

- [ ] **Step 2: Clean timers on unmount and preserve fallback path**

```ts
onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  revealTimers.forEach((timerId) => window.clearTimeout(timerId))
  revealTimers.clear()
})
```

- [ ] **Step 3: Update section class mapper**

```ts
const sectionRevealClass = (id: HomeSectionId) => ({
  'home-view__section--entering': sectionPhase.value[id] === 'entering' || sectionPhase.value[id] === 'visible',
  'home-view__section--visible': sectionPhase.value[id] === 'visible',
})
```

- [ ] **Step 4: Commit script changes**

```bash
git add src/views/HomeView.vue
git commit -m "feat(home): add staged section reveal phase state"
```

---

### Task 3: Add template reveal hooks and stagger indices

**Files:**
- Modify: `src\views\HomeView.vue`
- Test: `src\views\__tests__\HomeViewPortfolioSections.spec.ts`

- [ ] **Step 1: Add reveal hook classes/test IDs to section headers and content blocks**

```vue
<header data-testid="home-section-work-header" class="home-view__section-header home-view__reveal-header">
  ...
</header>
<div data-testid="home-section-work-content" class="home-view__reveal-content">
  <ExperienceTimeline :items="experienceItems" />
</div>
```

- [ ] **Step 2: Add stagger wrapper and child index style for skills**

```vue
<div data-testid="home-section-skills-grid" class="home-view__skills-grid home-view__reveal-content home-view__reveal-stagger">
  <div
    v-for="(category, index) in skillCategories"
    :key="category.id"
    class="home-view__reveal-item"
    :style="{ '--reveal-index': index }"
  >
    <SkillCardEnhanced :category="category" />
  </div>
</div>
```

- [ ] **Step 3: Apply same hooks for portfolio/education/social main bodies**

```vue
<article class="home-view__feature home-view__reveal-content">...</article>
<article class="home-view__basic-info home-view__reveal-content">...</article>
<div class="home-view__social-grid home-view__reveal-content">...</div>
```

- [ ] **Step 4: Commit template hook changes**

```bash
git add src/views/HomeView.vue
git commit -m "feat(home): add reveal hook markup and stagger indices"
```

---

### Task 4: Upgrade CSS to premium layered reveal motion

**Files:**
- Modify: `src\views\HomeView.vue`
- Test: `src\views\__tests__\HomeViewPortfolioSections.spec.ts`

- [ ] **Step 1: Add motion tokens and layered shell transition**

```css
.home-view__section {
  --reveal-section-duration: 650ms;
  --reveal-item-duration: 480ms;
  --reveal-stagger-step: 70ms;
  opacity: 0;
  transform: translateY(24px) scale(0.985);
  filter: blur(8px);
  transition:
    opacity var(--reveal-section-duration) cubic-bezier(0.22, 1, 0.36, 1),
    transform var(--reveal-section-duration) cubic-bezier(0.22, 1, 0.36, 1),
    filter var(--reveal-section-duration) cubic-bezier(0.22, 1, 0.36, 1);
}
```

- [ ] **Step 2: Add staged child reveal (header first, content second)**

```css
.home-view__reveal-header,
.home-view__reveal-content {
  opacity: 0;
  transform: translateY(14px) scale(0.992);
  filter: blur(5px);
}

.home-view__section--visible .home-view__reveal-header {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 60ms;
}

.home-view__section--visible .home-view__reveal-content {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 130ms;
}
```

- [ ] **Step 3: Add stagger timing for children**

```css
.home-view__reveal-stagger .home-view__reveal-item {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity var(--reveal-item-duration) cubic-bezier(0.22, 1, 0.36, 1),
    transform var(--reveal-item-duration) cubic-bezier(0.22, 1, 0.36, 1);
}

.home-view__section--visible .home-view__reveal-stagger .home-view__reveal-item {
  opacity: 1;
  transform: translateY(0);
  transition-delay: calc(160ms + (var(--reveal-index, 0) * var(--reveal-stagger-step)));
}
```

- [ ] **Step 4: Keep reduced-motion and print fully flattened**

```css
@media (prefers-reduced-motion: reduce), print {
  .home-view__section,
  .home-view__reveal-header,
  .home-view__reveal-content,
  .home-view__reveal-stagger .home-view__reveal-item {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
```

- [ ] **Step 5: Commit animation CSS**

```bash
git add src/views/HomeView.vue
git commit -m "feat(home): upgrade reveal motion to staged premium fade"
```

---

### Task 5: Verify and finalize

**Files:**
- Modify: `src\views\HomeView.vue` (if small adjustments needed)
- Modify: `src\views\__tests__\HomeViewPortfolioSections.spec.ts` (if assertions need exact class alignment)

- [ ] **Step 1: Run targeted HomeView tests**

Run: `npm run test:runtime -- src/views/__tests__/HomeViewPortfolioSections.spec.ts`
Expected: PASS with staged class assertions.

- [ ] **Step 2: Run full project verification**

Run: `npm test && npm run build`
Expected: PASS test suite and successful Vite build.

- [ ] **Step 3: Final commit**

```bash
git add src/views/HomeView.vue src/views/__tests__/HomeViewPortfolioSections.spec.ts
git commit -m "feat(home): smooth staged fade-in for section reveals"
```
