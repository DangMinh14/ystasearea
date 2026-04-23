<script setup lang="ts">
import type { SkillCategory } from './types'

const props = defineProps<{
  category: SkillCategory
}>()

const fallbackIcon = 'fa-solid fa-circle-question'
</script>

<template>
  <article class="skill-card-enhanced">
    <h3>{{ props.category.title }}</h3>

    <ul class="skill-card-enhanced__grid">
      <li v-for="skill in props.category.items" :key="skill.id" class="skill-card-enhanced__item">
        <i :data-testid="`skill-icon-${skill.id}`" :class="skill.iconClass || fallbackIcon" aria-hidden="true"></i>
        <span>{{ skill.label }}</span>

        <div class="skill-card-enhanced__dots">
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
