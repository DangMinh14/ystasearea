<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Locale } from '../content/translations'
import './SettingsMenu.css'
import americaFlag from '../assets/america_flag.png'
import vietnamFlag from '../assets/vietnam_flag.png'

type SettingsProps = {
  label: string
  themeLabel: string
  themeSelectLabel: string
  languageLabel: string
  currentTheme: 'light' | 'dark' | 'christmas' | 'lunar' | 'halloween'
  themeOptions: {
    value: 'light' | 'dark' | 'christmas' | 'lunar' | 'halloween'
    label: string
    icon: 'sun' | 'moon' | 'tree' | 'sparkles' | 'pumpkin'
  }[]
  currentLocale: Locale
}

const props = defineProps<SettingsProps>()

const emit = defineEmits<{
  (e: 'change-theme', theme: 'light' | 'dark' | 'christmas' | 'lunar' | 'halloween'): void
  (e: 'change-locale', locale: Locale): void
}>()

const isOpen = ref(false)
const themeIcon = (icon: 'sun' | 'moon' | 'tree' | 'sparkles' | 'pumpkin') => {
  if (icon === 'moon') return '🌙'
  if (icon === 'tree') return '🎄'
  if (icon === 'sparkles') return '🧧'
  if (icon === 'pumpkin') return '🎃'
  return '☀️'
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleTheme = (event: Event) => {
  const target = event.target as HTMLSelectElement
  isOpen.value = false
  emit('change-theme', target.value as SettingsProps['currentTheme'])
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
      <div class="layout__dropdown-group">
        <span class="layout__dropdown-label">{{ themeSelectLabel }}</span>
        <select class="layout__dropdown-select" :value="currentTheme" @change="handleTheme">
          <option v-for="option in themeOptions" :key="option.value" :value="option.value">
            {{ themeIcon(option.icon) }} {{ option.label }}
          </option>
        </select>
      </div>
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
