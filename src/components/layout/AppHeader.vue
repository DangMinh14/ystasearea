<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Locale } from '../../content/translations'
import AppNav from './AppNav.vue'

const props = defineProps<{
  brandName: string
  languageLabel: string
  experienceLabel: string
  skillsLabel: string
  projectsLabel: string
  contactLabel: string
  isDark: boolean
  currentLocale: Locale
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'change-locale', value: Locale): void
}>()

const navOpen = ref(false)

const links = computed(() => [
  { id: 'work-experience', label: props.experienceLabel },
  { id: 'technical-skills', label: props.skillsLabel },
  { id: 'portfolio', label: props.projectsLabel },
  { id: 'contact', label: props.contactLabel },
])

const toggleNav = () => {
  navOpen.value = !navOpen.value
}

const closeNav = () => {
  navOpen.value = false
}

const chooseLocale = (locale: Locale) => {
  emit('change-locale', locale)
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner surface">
      <RouterLink class="app-header__brand" :to="{ path: '/home', hash: '' }" @click="closeNav">
        <span class="app-header__mark" aria-hidden="true"></span>
        <strong>{{ brandName }}</strong>
      </RouterLink>

      <AppNav :is-open="navOpen" :links="links" @close="closeNav" />

      <div class="app-header__actions">
        <div class="app-header__locale" role="group" :aria-label="languageLabel">
          <button
            type="button"
            class="app-header__locale-option"
            :class="{ 'is-active': currentLocale === 'vi' }"
            :aria-pressed="currentLocale === 'vi'"
            @click="chooseLocale('vi')"
          >
            VI
          </button>
          <button
            type="button"
            class="app-header__locale-option"
            :class="{ 'is-active': currentLocale === 'en' }"
            :aria-pressed="currentLocale === 'en'"
            @click="chooseLocale('en')"
          >
            EN
          </button>
        </div>

        <button
          type="button"
          class="app-header__theme press"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="emit('toggle-theme')"
        >
          <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" aria-hidden="true"></i>
        </button>

        <button class="app-header__nav-toggle press" type="button" aria-label="Toggle menu" @click="toggleNav">
          <i :class="navOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </header>
</template>
