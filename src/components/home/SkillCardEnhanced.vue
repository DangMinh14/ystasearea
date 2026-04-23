<script setup lang="ts">
import type { SkillCategory } from './types'

const props = defineProps<{
  category: SkillCategory
}>()

const fallbackIcon = 'fa-solid fa-circle-question'
</script>

<template>
  <article class="skill-card-enhanced">
    <header class="skill-card-enhanced__header">
      <p class="text-eyebrow">Category</p>
      <h3>{{ props.category.title }}</h3>
    </header>

    <ul class="skill-card-enhanced__grid">
      <li v-for="skill in props.category.items" :key="skill.id" class="skill-card-enhanced__item">
        <div class="skill-card-enhanced__label-wrap">
          <span class="skill-card-enhanced__icon-wrap">
            <i :data-testid="`skill-icon-${skill.id}`" :class="skill.iconClass || fallbackIcon" aria-hidden="true"></i>
          </span>
          <span class="skill-card-enhanced__label">{{ skill.label }}</span>
        </div>

        <div
          :data-testid="`skill-level-${skill.id}`"
          class="skill-card-enhanced__dots"
          role="img"
          :aria-label="`Proficiency level: ${skill.level} out of 5`"
        >
          <span
            v-for="index in 5"
            :key="index"
            :data-testid="`skill-dot-${skill.id}`"
            class="skill-card-enhanced__dot"
            :class="{ 'skill-card-enhanced__dot--active': index <= skill.level }"
          />
        </div>
      </li>
    </ul>
  </article>
</template>

<style scoped>
.skill-card-enhanced {
  display: grid;
  gap: var(--space-4);
  height: 100%;
  padding: clamp(var(--space-4), 2.4vw, var(--space-6));
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background:
    linear-gradient(148deg, color-mix(in srgb, var(--surface-2) 90%, transparent), color-mix(in srgb, var(--surface-1) 88%, transparent)),
    linear-gradient(22deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 64%);
  box-shadow: var(--shadow-card);
  transition: transform 220ms var(--ease-standard), box-shadow 220ms var(--ease-standard);
}

.skill-card-enhanced:hover {
  transform: scale(1.02);
  box-shadow: 0 16px 34px color-mix(in srgb, var(--accent) 20%, transparent);
}

.skill-card-enhanced__header {
  display: grid;
  gap: var(--space-1);
}

.skill-card-enhanced__header > h3 {
  margin: 0;
  font-size: 1.1rem;
}

.skill-card-enhanced__grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}

.skill-card-enhanced__item {
  display: grid;
  gap: var(--space-2);
  align-content: start;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--border-subtle) 84%, transparent);
  background: color-mix(in srgb, var(--surface-1) 90%, transparent);
}

.skill-card-enhanced__label-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.skill-card-enhanced__icon-wrap {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.skill-card-enhanced__label {
  font-weight: 600;
}

.skill-card-enhanced__dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.skill-card-enhanced__dot {
  width: 9px;
  height: 9px;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
  background: color-mix(in srgb, var(--surface-3) 90%, transparent);
}

.skill-card-enhanced__dot--active {
  background: color-mix(in srgb, var(--accent) 88%, transparent);
  border-color: color-mix(in srgb, var(--accent) 78%, transparent);
}

@media (max-width: 640px) {
  .skill-card-enhanced__grid {
    grid-template-columns: repeat(auto-fit, minmax(136px, 1fr));
  }
}

@media (prefers-reduced-motion: reduce), print {
  .skill-card-enhanced {
    transition: none;
    transform: none;
  }

  .skill-card-enhanced:hover {
    transform: none;
    box-shadow: var(--shadow-card);
  }
}
</style>
