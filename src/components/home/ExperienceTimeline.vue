<script setup lang="ts">
import { ref } from 'vue'
import type { ExperienceNode } from './types'

defineProps<{
  items: ExperienceNode[]
}>()

const expanded = ref<Record<string, boolean>>({})

const getResponsibilitiesId = (id: string) => `responsibilities-${id}`

const toggleResponsibilities = (id: string) => {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
}
</script>

<template>
  <section class="experience-timeline">
    <div data-testid="timeline-spine" class="experience-timeline__spine" aria-hidden="true"></div>
    <article v-for="item in items" :key="item.id" class="experience-timeline__node">
      <header class="experience-timeline__header">
        <h3>{{ item.company }}</h3>
        <p>{{ item.role }}</p>
        <span>{{ item.period }}</span>
      </header>

      <ul>
        <li v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</li>
      </ul>

      <button
        v-if="item.responsibilities.length"
        :data-testid="`toggle-responsibilities-${item.id}`"
        :aria-expanded="expanded[item.id] ? 'true' : 'false'"
        :aria-controls="getResponsibilitiesId(item.id)"
        type="button"
        @click="toggleResponsibilities(item.id)"
      >
        {{ expanded[item.id] ? 'Show less' : 'Show more' }}
      </button>

      <ul v-if="expanded[item.id]" :id="getResponsibilitiesId(item.id)">
        <li v-for="responsibility in item.responsibilities" :key="responsibility">
          {{ responsibility }}
        </li>
      </ul>
    </article>
  </section>
</template>
