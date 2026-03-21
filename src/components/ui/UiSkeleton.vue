<script setup lang="ts">
import './ui.css'

defineProps<{
  variant?: 'line' | 'block'
}>()
</script>

<template>
  <div class="ui-skeleton" :class="variant === 'line' ? 'ui-skeleton--line' : 'ui-skeleton--block'"></div>
</template>
