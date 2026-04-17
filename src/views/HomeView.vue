<script setup lang="ts">
import { inject } from 'vue'
import ProfileHero from '../components/home/ProfileHero.vue'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)

if (!shell) {
  throw new Error('HomeView requires shell context')
}
</script>

<template>
  <section class="home-view">
    <ProfileHero
      :role="shell.t.value.homeRole"
      :name="shell.t.value.homeName"
      :intro="shell.t.value.homeIntro"
      :projects-label="shell.t.value.homeViewProjects"
      :cv-label="shell.t.value.homeViewCv"
      :image-alt="shell.t.value.homeImageAlt"
    />
  </section>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: 0;
}
</style>
