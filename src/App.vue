<script setup lang="ts">
import PageShell from './components/PageShell.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <PageShell v-if="route.meta.shell !== false">
      <component :is="Component" />
    </PageShell>
    <component v-else :is="Component" />
  </RouterView>
</template>
