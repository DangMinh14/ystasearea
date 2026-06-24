<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebarWidgets from './AppSidebarWidgets.vue'
import AppFooter from './AppFooter.vue'
import { useThemeSettings } from '../../composables/useThemeSettings'
import { useLocaleSettings } from '../../composables/useLocaleSettings'
import { useQuote } from '../../composables/useQuote'
import { useMediaWidgets } from '../../composables/useMediaWidgets'
import { appShellContextKey, type AppShellContext } from '../../composables/appShellContext'
import './app-layout.css'

const { theme, isDarkTheme, setTheme, toggleTheme, hydrateTheme } = useThemeSettings()
const { locale, t, hydrateLocale, changeLocale } = useLocaleSettings()
const { quote, quoteLoading, quoteError, loadQuote } = useQuote()
const { catImageUrl, catLoading, dogImageUrl, dogLoading, loadCatImage, loadDogImage } = useMediaWidgets()
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
  catImageUrl,
  catLoading,
  dogImageUrl,
  dogLoading,
  refreshCat: loadCatImage,
  refreshDog: loadDogImage,
}

provide(appShellContextKey, context)

onMounted(() => {
  hydrateTheme()
  hydrateLocale()
  loadQuote()
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
      <span class="app-shell__aurora app-shell__aurora--a"></span>
      <span class="app-shell__aurora app-shell__aurora--b"></span>
      <span class="app-shell__aurora app-shell__aurora--c"></span>
      <span class="app-shell__grid"></span>
    </div>

    <div class="app-shell__content">
      <AppHeader
        :brand-name="t.brandName"
        :language-label="t.languageLabel"
        :home-label="t.navHome"
        :blog-label="t.navBlog"
        :games-label="t.navGames"
        :tools-label="t.navTools"
        :is-dark="isDarkTheme"
        :current-locale="locale"
        @toggle-theme="toggleTheme"
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
