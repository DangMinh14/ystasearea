<script setup lang="ts">
import './ui.css'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="ui-error" role="alert">
    <h3>{{ title }}</h3>
    <p class="text-muted">{{ description }}</p>
  </div>
</template>
