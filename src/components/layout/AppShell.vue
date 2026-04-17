<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebarWidgets from './AppSidebarWidgets.vue'
import AppFooter from './AppFooter.vue'
import { useThemeSettings } from '../../composables/useThemeSettings'
import { useLocaleSettings } from '../../composables/useLocaleSettings'
import { useQuote } from '../../composables/useQuote'
import { useWeather } from '../../composables/useWeather'
import { useMediaWidgets } from '../../composables/useMediaWidgets'
import { usePlaylist } from '../../composables/usePlaylist'
import { appShellContextKey, type AppShellContext } from '../../composables/appShellContext'
import bgVideo from '../../assets/bg.mp4'
import lunarBg from '../../assets/lunar-bg.jpg'
import halloweenBg from '../../assets/halloween-bg.jpg'
import './app-layout.css'

const { theme, isLunarTheme, isHalloweenTheme, setTheme, hydrateTheme } = useThemeSettings()
const { locale, t, hydrateLocale, changeLocale } = useLocaleSettings()
const { quote, quoteLoading, quoteError, loadQuote } = useQuote()
const { weather, weatherLoading, weatherError, weatherLocation, weatherLocations, loadWeather } = useWeather()
const { catImageUrl, catLoading, dogImageUrl, dogLoading, loadCatImage, loadDogImage } = useMediaWidgets()
const { playlist, currentVideoIndex, currentVideo, onNextVideo, onPrevVideo, onSelectVideo, mp3Tracks } = usePlaylist()
const route = useRoute()
const showBackToTop = ref(false)

const isSidebarVisible = computed(() => route.meta.showSidebar === true)

const onWindowScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const context: AppShellContext = {
  locale,
  t,
  theme,
  setTheme,
  changeLocale,
  quote,
  quoteLoading,
  quoteError,
  weather,
  weatherLoading,
  weatherError,
  weatherLocation,
  weatherLocations,
  catImageUrl,
  catLoading,
  dogImageUrl,
  dogLoading,
  refreshCat: loadCatImage,
  refreshDog: loadDogImage,
  playlist,
  currentVideoIndex,
  currentVideo,
  onNextVideo,
  onPrevVideo,
  onSelectVideo,
  mp3Tracks,
}

provide(appShellContextKey, context)

onMounted(() => {
  hydrateTheme()
  hydrateLocale()
  loadQuote()
  loadWeather()
  loadCatImage()
  loadDogImage()
  onWindowScroll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
})
</script>

<template>
  <div class="app-shell">
    <div class="app-shell__background" aria-hidden="true">
      <img v-if="isLunarTheme" :src="lunarBg" alt="" />
      <img v-else-if="isHalloweenTheme" :src="halloweenBg" alt="" />
      <video v-else :src="bgVideo" autoplay muted loop playsinline></video>
    </div>
    <div class="app-shell__overlay" aria-hidden="true"></div>

    <div class="app-shell__content">
      <AppHeader
        :brand-name="t.brandName"
        :settings-label="t.settingsLabel"
        :theme-select-label="t.themeSelectLabel"
        :language-label="t.languageLabel"
        :home-label="t.navHome"
        :blog-label="t.navBlog"
        :games-label="t.navGames"
        :music-label="t.navMusic"
        :tools-label="t.navTools"
        :current-theme="theme"
        :current-locale="locale"
        :theme-options="[
          { value: 'light', label: t.lightLabel },
          { value: 'dark', label: t.darkLabel },
          { value: 'christmas', label: t.christmasLabel },
          { value: 'lunar', label: t.lunarLabel },
          { value: 'halloween', label: t.halloweenLabel },
        ]"
        @change-theme="setTheme"
        @change-locale="changeLocale"
      />

      <div class="app-shell__main-grid" :class="isSidebarVisible ? 'app-shell__main-grid--with-sidebar' : 'app-shell__main-grid--no-sidebar'">
        <main class="app-shell__main page-enter">
          <slot />
        </main>
        <AppSidebarWidgets
          v-if="isSidebarVisible"
          :quote-title="t.quoteTitle"
          :quote-loading-text="t.quoteLoading"
          :quote-error-text="t.quoteError"
          :quote="quote"
          :quote-loading="quoteLoading"
          :quote-error="quoteError"
          :weather-title="t.weatherTitle"
          :weather-loading-text="t.weatherLoading"
          :weather-error-text="t.weatherError"
          :weather-temp-label="t.weatherTempLabel"
          :weather-wind-label="t.weatherWindLabel"
          :weather-location-label="t.weatherLocationLabel"
          :weather-locations="weatherLocations"
          :weather-location="weatherLocation"
          :weather="weather"
          :weather-loading="weatherLoading"
          :weather-error="weatherError"
          :cat-title="t.catTitle"
          :cat-button="t.catButton"
          :cat-loading-text="t.catLoading"
          :cat-image-url="catImageUrl"
          :cat-loading="catLoading"
          :dog-title="t.dogTitle"
          :dog-button="t.dogButton"
          :dog-loading-text="t.dogLoading"
          :dog-image-url="dogImageUrl"
          :dog-loading="dogLoading"
          @change-weather-location="weatherLocation = $event"
          @refresh-cat="loadCatImage"
          @refresh-dog="loadDogImage"
        />
      </div>

      <AppFooter :copy="t.footerCopy" />
    </div>

    <Transition name="back-to-top">
      <button v-if="showBackToTop" class="app-back-to-top" type="button" :aria-label="t.backToTopLabel" @click="scrollToTop">
        <span aria-hidden="true">↑</span>
      </button>
    </Transition>
  </div>
</template>
