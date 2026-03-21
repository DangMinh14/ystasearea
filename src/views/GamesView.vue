<script setup lang="ts">
import { inject } from 'vue'
import GameHub from '../features/games/components/GameHub.vue'
import UiSectionHeader from '../components/ui/UiSectionHeader.vue'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)
if (!shell) {
  throw new Error('GamesView requires shell context')
}
</script>

<template>
  <section class="games-view">
    <UiSectionHeader eyebrow="Games" :title="shell.t.value.gamesTitle" :subtitle="shell.t.value.gamesSubtitle" />
    <GameHub />
  </section>
</template>

<style scoped>
.games-view {
  display: grid;
  gap: var(--space-4);
}
</style>
