<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MainLayout from './MainLayout.vue'
import SettingsMenu from './SettingsMenu.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import { translations, type Locale } from '../content/translations'
import bgVideo from '../assets/bg.mp4'
import './PageShell.css'

const THEME_KEY = 'ystasearea-theme'
const LOCALE_KEY = 'ystasearea-locale'

const isDark = ref(true)
const isWelcome = ref(true)
const locale = ref<Locale>('vi')
const currentVideoIndex = ref(0)
const quote = ref<{ content: string; author: string } | null>(null)
const quoteLoading = ref(false)
const quoteError = ref('')

const playlist = [
  { id: '8scL5oJX6CM', title: 'Video 1' },
  { id: 'tbfumVRH7Ls', title: 'Video 2' },
  { id: 'SO_zCJkZdkY', title: 'Video 3' },
  { id: 'f3jlAJ6CxDo', title: 'Video 4' },
]

const t = computed(() => translations[locale.value])

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}

const changeLocale = (nextLocale: Locale) => {
  locale.value = nextLocale
  localStorage.setItem(LOCALE_KEY, nextLocale)
}

const enterSite = () => {
  isWelcome.value = false
}

const goNextVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % playlist.length
}

const goPrevVideo = () => {
  currentVideoIndex.value =
    (currentVideoIndex.value - 1 + playlist.length) % playlist.length
}

const selectVideo = (index: number) => {
  currentVideoIndex.value = index
}

const hello = () => {
  alert('Xin chào từ ystasearea.space!')
}

const loadDailyQuote = async () => {
  quoteLoading.value = true
  quoteError.value = ''
  try {
    const response = await fetch('/api/quote')
    if (!response.ok) {
      throw new Error('Quote request failed')
    }
    const data = await response.json()
    if (Array.isArray(data)) {
      const first = data[0]
      if (!first?.q) {
        throw new Error('Invalid quote payload')
      }
      quote.value = { content: first.q, author: first.a ?? 'Unknown' }
      return
    }

    if (!data?.content) {
      throw new Error('Invalid quote payload')
    }

    quote.value = { content: data.content, author: data.author ?? 'Unknown' }
  } catch (error) {
    quoteError.value = 'error'
  } finally {
    quoteLoading.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'light') {
    isDark.value = false
  }
  const savedLocale = localStorage.getItem(LOCALE_KEY)
  if (savedLocale === 'en' || savedLocale === 'vi') {
    locale.value = savedLocale
  }
  applyTheme()
  loadDailyQuote()
})
</script>

<template>
  <main class="app">
    <div class="app__background" aria-hidden="true">
      <video class="app__video" :src="bgVideo" autoplay muted loop playsinline></video>
    </div>
    <div class="app__overlay" aria-hidden="true"></div>
    <WelcomeScreen
      v-if="isWelcome"
      :badge="t.welcomeBadge"
      :title="t.welcomeTitle"
      :subtitle="t.welcomeSubtitle"
      @enter="enterSite"
    />

    <MainLayout
      v-else
      :header-eyebrow="t.headerEyebrow"
      :header-title="t.headerTitle"
      :nav-home="t.navHome"
      :nav-posts="t.navPosts"
      :nav-projects="t.navProjects"
      :nav-contact="t.navContact"
      :daily-quote-title="t.dailyQuoteTitle"
      :daily-quote-loading="t.dailyQuoteLoading"
      :daily-quote-error="t.dailyQuoteError"
      :quote="quote"
      :quote-loading="quoteLoading"
      :quote-error="quoteError"
      :music-title="t.musicTitle"
      :music-text="t.musicText"
      :player-prev="t.playerPrev"
      :player-next="t.playerNext"
      :playlist-label="t.playlistLabel"
      :playlist="playlist"
      :current-video-index="currentVideoIndex"
      :footer-copy="t.footerCopy"
      :footer-button="t.footerButton"
      @hello="hello"
      @next-video="goNextVideo"
      @prev-video="goPrevVideo"
      @select-video="selectVideo"
    >
      <template #settings>
        <SettingsMenu
          :label="t.settingsLabel"
          :theme-label="t.themeLabel"
          :language-label="t.languageLabel"
          :current-theme-label="isDark ? t.darkLabel : t.lightLabel"
          :current-locale="locale"
          @toggle-theme="toggleTheme"
          @change-locale="changeLocale"
        />
      </template>
    </MainLayout>
  </main>
</template>
