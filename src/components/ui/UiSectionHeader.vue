<script setup lang="ts">
import './ui.css'

defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="ui-section-header">
    <p v-if="eyebrow" class="text-eyebrow">{{ eyebrow }}</p>
    <h2 class="ui-section-header__title">{{ title }}</h2>
    <p v-if="subtitle" class="ui-section-header__subtitle">{{ subtitle }}</p>
  </header>
</template>
