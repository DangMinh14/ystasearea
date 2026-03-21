<script setup lang="ts">
import AppShell from './components/layout/AppShell.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <AppShell v-if="route.meta.shell !== false">
      <component :is="Component" />
    </AppShell>
    <component :is="Component" v-else />
  </RouterView>
</template>
