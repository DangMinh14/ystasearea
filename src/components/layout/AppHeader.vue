<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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
  isLoggedIn: boolean
  userDisplayName?: string
  userAvatarUrl?: string
}>()

const emit = defineEmits<{
  (e: 'change-theme', value: AppTheme): void
  (e: 'change-locale', value: Locale): void
  (e: 'login'): void
  (e: 'logout'): void
}>()

const navOpen = ref(false)
const settingsOpen = ref(false)
const settingsAnchorRef = ref<HTMLElement | null>(null)
const settingsMenuRef = ref<HTMLElement | null>(null)

const MENU_GAP = 8
const VIEWPORT_MARGIN = 12

const toggleSettings = async () => {
  settingsOpen.value = !settingsOpen.value
  if (settingsOpen.value) {
    await nextTick()
    updateMenuPosition()
  }
}

const toggleNav = () => {
  navOpen.value = !navOpen.value
}

const closeNav = () => {
  navOpen.value = false
}

const closeSettings = () => {
  settingsOpen.value = false
}

const onThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change-theme', target.value as AppTheme)
}

const chooseLocale = (locale: Locale) => {
  emit('change-locale', locale)
}

const updateMenuPosition = () => {
  if (!settingsOpen.value) return

  const anchor = settingsAnchorRef.value
  const menu = settingsMenuRef.value
  if (!anchor || !menu) return

  const anchorRect = anchor.getBoundingClientRect()
  const menuWidth = menu.offsetWidth || 240
  const maxLeft = window.innerWidth - menuWidth - VIEWPORT_MARGIN

  const top = anchorRect.bottom + MENU_GAP
  const left = Math.max(VIEWPORT_MARGIN, Math.min(anchorRect.right - menuWidth, maxLeft))

  menu.style.top = `${top}px`
  menu.style.left = `${left}px`
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!settingsOpen.value) return

  const target = event.target as Node
  const anchor = settingsAnchorRef.value
  const menu = settingsMenuRef.value

  if (!anchor || !menu) return

  if (!anchor.contains(target) && !menu.contains(target)) {
    closeSettings()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && settingsOpen.value) {
    closeSettings()
  }
}

watch(settingsOpen, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  updateMenuPosition()
})

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentClick)
  window.addEventListener('resize', updateMenuPosition)
  window.addEventListener('scroll', updateMenuPosition, true)
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocumentClick)
  window.removeEventListener('resize', updateMenuPosition)
  window.removeEventListener('scroll', updateMenuPosition, true)
  window.removeEventListener('keydown', handleEscape)
})
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

    <div ref="settingsAnchorRef" class="app-header__settings">
      <UiButton variant="ghost" size="sm" @click="toggleSettings">{{ settingsLabel }}</UiButton>
    </div>

    <div class="app-header__auth">
      <template v-if="isLoggedIn">
        <div class="app-header__user">
          <img
            v-if="userAvatarUrl"
            :src="userAvatarUrl"
            :alt="userDisplayName"
            class="app-header__avatar"
          />
          <span class="app-header__user-name">{{ userDisplayName }}</span>
        </div>
        <UiButton variant="ghost" size="sm" @click="emit('logout')">Logout</UiButton>
      </template>
      <template v-else>
        <UiButton variant="ghost" size="sm" @click="emit('login')">Login</UiButton>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="settingsOpen" ref="settingsMenuRef" class="app-header__settings-menu surface" role="dialog" aria-modal="false">
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
    </Teleport>
  </header>
</template>
