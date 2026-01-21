<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Locale } from '../content/translations'
import './SettingsMenu.css'
import americaFlag from '../assets/america_flag.png'
import vietnamFlag from '../assets/vietnam_flag.png'

type SettingsProps = {
  label: string
  themeLabel: string
  languageLabel: string
  currentThemeLabel: string
  currentLocale: Locale
}

const props = defineProps<SettingsProps>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'change-locale', locale: Locale): void
}>()

const isOpen = ref(false)
const isDarkTheme = computed(() => props.currentThemeLabel.toLowerCase().includes('dark'))
const themeIcon = computed(() => (isDarkTheme.value ? '🌙' : '☀️'))

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleTheme = () => {
  isOpen.value = false
  emit('toggle-theme')
}

const handleLocale = (locale: Locale) => {
  isOpen.value = false
  emit('change-locale', locale)
}
</script>

<template>
  <div class="layout__settings">
    <button class="layout__button layout__button--ghost" type="button" @click="toggleMenu">
      {{ label }}
    </button>
    <div v-if="isOpen" class="layout__dropdown">
      <button class="layout__dropdown-item" type="button" @click="handleTheme">
        <span aria-hidden="true">{{ themeIcon }}</span>
        {{ themeLabel }}: {{ currentThemeLabel }}
      </button>
      <div class="layout__dropdown-group">
        <span class="layout__dropdown-label">{{ languageLabel }}</span>
        <button
          class="layout__dropdown-item"
          type="button"
          :aria-pressed="currentLocale === 'vi'"
          @click="handleLocale('vi')"
        >
          <img class="layout__flag-icon" :src="vietnamFlag" alt="Vietnam flag" />
          VI
        </button>
        <button
          class="layout__dropdown-item"
          type="button"
          :aria-pressed="currentLocale === 'en'"
          @click="handleLocale('en')"
        >
          <img class="layout__flag-icon" :src="americaFlag" alt="USA flag" />
          EN
        </button>
      </div>
    </div>
  </div>
</template>
