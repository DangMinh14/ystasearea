<script setup lang="ts">
import { ref } from 'vue'
import type { ExperienceNode } from './types'

defineProps<{
  items: ExperienceNode[]
}>()

const expanded = ref<Record<string, boolean>>({})
const fallbackNodeIcon = 'fa-solid fa-briefcase'

const getResponsibilitiesId = (id: string) => `responsibilities-${id}`
const getNodeIcon = (iconClass?: string) => iconClass || fallbackNodeIcon

const toggleResponsibilities = (id: string) => {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
}
</script>

<template>
  <section class="experience-timeline experience-timeline--focus-fade">
    <div data-testid="timeline-spine" class="experience-timeline__spine" aria-hidden="true"></div>
    <article
      v-for="item in items"
      :key="item.id"
      class="experience-timeline__node experience-timeline__node--interactive"
    >
      <div class="experience-timeline__identity" aria-hidden="true">
        <span
          :data-testid="`timeline-node-marker-${item.id}`"
          class="experience-timeline__marker experience-timeline__marker--interactive"
        >
          <i :class="getNodeIcon(item.iconClass)" aria-hidden="true"></i>
        </span>
      </div>

      <div class="experience-timeline__content">
        <header class="experience-timeline__header">
          <h3 :data-testid="`timeline-role-${item.id}`" class="experience-timeline__role">{{ item.role }}</h3>
          <p :data-testid="`timeline-company-${item.id}`" class="experience-timeline__company">
            {{ item.company }}
          </p>
          <p :data-testid="`timeline-period-${item.id}`" class="experience-timeline__period">{{ item.period }}</p>
        </header>

        <section class="experience-timeline__achievements">
          <p class="experience-timeline__subheading">Key achievements</p>
          <ul class="experience-timeline__list experience-timeline__list--achievements">
            <li v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </section>

        <div v-if="item.tags.length || item.metrics.length" class="experience-timeline__chips">
          <ul v-if="item.tags.length" class="experience-timeline__chip-list" aria-label="Technology stack">
            <li v-for="tag in item.tags" :key="`tag-${item.id}-${tag}`">
              <span :data-testid="`tech-tag-${item.id}`" class="experience-timeline__chip experience-timeline__chip--tag">
                {{ tag }}
              </span>
            </li>
          </ul>

          <ul v-if="item.metrics.length" class="experience-timeline__chip-list" aria-label="Impact metrics">
            <li v-for="metric in item.metrics" :key="`metric-${item.id}-${metric}`">
              <span :data-testid="`metric-chip-${item.id}`" class="experience-timeline__chip experience-timeline__chip--metric">
                {{ metric }}
              </span>
            </li>
          </ul>
        </div>

        <section v-if="item.responsibilities.length" class="experience-timeline__responsibilities">
          <button
            :data-testid="`toggle-responsibilities-${item.id}`"
            :aria-expanded="expanded[item.id] ? 'true' : 'false'"
            :aria-controls="getResponsibilitiesId(item.id)"
            class="experience-timeline__toggle"
            type="button"
            @click="toggleResponsibilities(item.id)"
          >
            {{ expanded[item.id] ? 'Show less' : 'Show more' }}
          </button>

          <ul v-if="expanded[item.id]" :id="getResponsibilitiesId(item.id)" class="experience-timeline__list experience-timeline__list--responsibilities">
            <li v-for="responsibility in item.responsibilities" :key="responsibility">
              {{ responsibility }}
            </li>
          </ul>
        </section>
      </div>
    </article>
  </section>
</template>

<style scoped>
.experience-timeline {
  position: relative;
  display: grid;
  gap: var(--space-5);
  padding-left: clamp(var(--space-5), 3vw, var(--space-7));
}

.experience-timeline__spine {
  position: absolute;
  top: var(--space-3);
  bottom: var(--space-3);
  left: clamp(var(--space-2), 1.8vw, var(--space-4));
  width: 2px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--accent) 72%, transparent),
    color-mix(in srgb, var(--accent) 30%, transparent)
  );
}

.experience-timeline__node {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--space-4);
  padding: clamp(var(--space-4), 2.4vw, var(--space-6));
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background:
    linear-gradient(132deg, color-mix(in srgb, var(--surface-2) 92%, transparent), color-mix(in srgb, var(--surface-1) 88%, transparent)),
    linear-gradient(12deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 52%);
  box-shadow: var(--shadow-card);
  transition:
    transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.experience-timeline__node--interactive:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  background:
    linear-gradient(132deg, color-mix(in srgb, var(--surface-2) 94%, transparent), color-mix(in srgb, var(--surface-1) 90%, transparent)),
    linear-gradient(12deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 52%);
}

.experience-timeline--focus-fade:hover .experience-timeline__node--interactive {
  opacity: 0.6;
}

.experience-timeline--focus-fade .experience-timeline__node--interactive:hover {
  opacity: 1;
}

.experience-timeline__identity {
  padding-top: 3px;
}

.experience-timeline__marker {
  position: relative;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
  background: color-mix(in srgb, var(--surface-1) 84%, var(--accent) 16%);
  color: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--surface-1) 94%, transparent);
  transition:
    transform 220ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.experience-timeline__node--interactive:hover .experience-timeline__marker--interactive {
  transform: scale(1.15);
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.05);
}

.experience-timeline__content {
  display: grid;
  gap: var(--space-4);
}

.experience-timeline__header {
  display: grid;
  gap: var(--space-1);
}

.experience-timeline__role {
  margin: 0;
  font-size: clamp(1.06rem, 2vw, 1.3rem);
}

.experience-timeline__company,
.experience-timeline__period {
  margin: 0;
}

.experience-timeline__company {
  color: var(--text-secondary);
  font-weight: 600;
}

.experience-timeline__period {
  font-size: 0.92rem;
  color: color-mix(in srgb, var(--text-secondary) 82%, transparent);
}

.experience-timeline__achievements {
  display: grid;
  gap: var(--space-2);
}

.experience-timeline__subheading {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--text-secondary);
}

.experience-timeline__list {
  margin: 0;
  padding-left: var(--space-5);
  display: grid;
  gap: var(--space-2);
}

.experience-timeline__list--achievements {
  font-weight: 560;
}

.experience-timeline__list--achievements li {
  border-radius: 4px;
  transition: background 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.experience-timeline__list--achievements li:hover {
  background: linear-gradient(transparent 70%, rgba(255, 255, 255, 0.1) 70%);
}

.experience-timeline__list--responsibilities {
  color: var(--text-secondary);
}

.experience-timeline__chips {
  display: grid;
  gap: var(--space-2);
}

.experience-timeline__chip-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.experience-timeline__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.36rem 0.62rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 600;
}

.experience-timeline__chip--tag {
  background: color-mix(in srgb, var(--surface-3) 86%, transparent);
  color: var(--text-secondary);
  border: 1px solid color-mix(in srgb, var(--border-subtle) 86%, transparent);
}

.experience-timeline__chip--metric {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: color-mix(in srgb, var(--text-primary) 80%, var(--accent) 20%);
  border: 1px solid color-mix(in srgb, var(--accent) 42%, transparent);
}

.experience-timeline__chip {
  transition:
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.experience-timeline__chip:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border-subtle));
}

.experience-timeline__responsibilities {
  display: grid;
  gap: var(--space-2);
}

.experience-timeline__toggle {
  justify-self: start;
  padding: 0.42rem 0.82rem;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent);
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 767px) {
  .experience-timeline {
    padding-left: var(--space-4);
  }

  .experience-timeline__spine {
    left: 13px;
  }

  .experience-timeline__node {
    grid-template-columns: 28px 1fr;
    gap: var(--space-3);
  }

  .experience-timeline__marker {
    width: 28px;
    height: 28px;
    font-size: 0.84rem;
  }
}

@media (prefers-reduced-motion: reduce), print {
  .experience-timeline__node {
    transition: none;
  }

  .experience-timeline__node:hover {
    box-shadow: var(--shadow-card);
  }

  .experience-timeline--focus-fade:hover .experience-timeline__node {
    opacity: 1;
  }

  .experience-timeline__marker {
    transition: none;
    transform: none;
  }

  .experience-timeline__list--achievements li,
  .experience-timeline__chip {
    transition: none;
  }
}
</style>
