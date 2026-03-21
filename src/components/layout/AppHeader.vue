<script setup lang="ts">
import { ref } from 'vue'
import UiButton from '../ui/UiButton.vue'
import type { AppTheme } from '../../composables/useThemeSettings'
import type { Locale } from '../../content/translations'
import AppNav from './AppNav.vue'

defineProps<{
  brandName: string
  settingsLabel: string
  themeSelectLabel: string
  languageLabel: string
  homeLabel: string
  blogLabel: string
  gamesLabel: string
  musicLabel: string
  toolsLabel: string
  currentTheme: AppTheme
  currentLocale: Locale
  themeOptions: Array<{ value: AppTheme; label: string }>
}>()

const emit = defineEmits<{
  (e: 'change-theme', value: AppTheme): void
  (e: 'change-locale', value: Locale): void
}>()

const navOpen = ref(false)
const settingsOpen = ref(false)

const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value
}

const toggleNav = () => {
  navOpen.value = !navOpen.value
}

const closeNav = () => {
  navOpen.value = false
}

const onThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change-theme', target.value as AppTheme)
}

const chooseLocale = (locale: Locale) => {
  emit('change-locale', locale)
}
</script>

<template>
  <header class="app-header surface">
    <RouterLink class="app-header__brand" to="/home">
      <span class="text-eyebrow">Creative Studio</span>
      <strong>{{ brandName }}</strong>
    </RouterLink>

    <button class="app-header__nav-toggle" type="button" aria-label="Toggle menu" @click="toggleNav">
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>

    <AppNav
      :is-open="navOpen"
      :home-label="homeLabel"
      :blog-label="blogLabel"
      :games-label="gamesLabel"
      :music-label="musicLabel"
      :tools-label="toolsLabel"
      @close="closeNav"
    />

    <div class="app-header__settings">
      <UiButton variant="ghost" size="sm" @click="toggleSettings">{{ settingsLabel }}</UiButton>
      <div v-if="settingsOpen" class="app-header__settings-menu surface">
        <label class="app-header__field">
          <span class="text-muted">{{ themeSelectLabel }}</span>
          <select class="ui-select" :value="currentTheme" @change="onThemeChange">
            <option v-for="item in themeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>

        <div class="app-header__locales">
          <span class="text-muted">{{ languageLabel }}</span>
          <div class="app-header__locale-toggle" role="group" aria-label="Language selection">
            <button
              type="button"
              class="app-header__locale-option"
              :class="{ 'app-header__locale-option--active': currentLocale === 'vi' }"
              :aria-pressed="currentLocale === 'vi'"
              @click="chooseLocale('vi')"
            >
              VI
            </button>
            <button
              type="button"
              class="app-header__locale-option"
              :class="{ 'app-header__locale-option--active': currentLocale === 'en' }"
              :aria-pressed="currentLocale === 'en'"
              @click="chooseLocale('en')"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
