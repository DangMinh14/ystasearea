<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <footer class="app-footer surface">
    <p>{{ copy }}</p>
  </footer>
</template>
