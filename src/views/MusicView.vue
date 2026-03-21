<script setup lang="ts">
import { inject } from 'vue'
import MusicShowcase from '../features/music/components/MusicShowcase.vue'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)
if (!shell) {
  throw new Error('MusicView requires shell context')
}
</script>

<template>
  <MusicShowcase
    :title="shell.t.value.musicTitle"
    :subtitle="shell.t.value.musicSubtitle"
    :tracks="shell.mp3Tracks"
    :playlist="shell.playlist"
    :current-video-index="shell.currentVideoIndex.value"
    @prev-video="shell.onPrevVideo"
    @next-video="shell.onNextVideo"
    @select-video="shell.onSelectVideo"
  />
</template>
