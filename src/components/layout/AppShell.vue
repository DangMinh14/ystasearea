<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { useThemeSettings } from '../../composables/useThemeSettings'
import { useLocaleSettings } from '../../composables/useLocaleSettings'
import { useQuote } from '../../composables/useQuote'
import { useMediaWidgets } from '../../composables/useMediaWidgets'
import { appShellContextKey, type AppShellContext } from '../../composables/appShellContext'
import './app-layout.css'

const { theme, isDarkTheme, setTheme, toggleTheme, hydrateTheme } = useThemeSettings()
const { locale, t, hydrateLocale, changeLocale } = useLocaleSettings()
const { quote, quoteLoading, quoteError } = useQuote()
const { catImageUrl, catLoading, dogImageUrl, dogLoading, loadCatImage, loadDogImage } = useMediaWidgets()

const showBackToTop = ref(false)
const backgroundRef = ref<HTMLElement | null>(null)

let pointerX = 50
let pointerY = 30
let ticking = false
let motionAllowed = true

const applyPointer = () => {
  ticking = false
  backgroundRef.value?.style.setProperty('--spot-x', `${pointerX}%`)
  backgroundRef.value?.style.setProperty('--spot-y', `${pointerY}%`)
}

const onPointerMove = (event: PointerEvent) => {
  if (!motionAllowed) return
  pointerX = (event.clientX / window.innerWidth) * 100
  pointerY = (event.clientY / window.innerHeight) * 100
  if (!ticking) {
    ticking = true
    requestAnimationFrame(applyPointer)
  }
}

const onWindowScroll = () => {
  showBackToTop.value = window.scrollY > 320
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Context is kept intact for downstream consumers/tests even though the
// quote/pet widgets are no longer surfaced in the UI.
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
  onWindowScroll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })

  motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (motionAllowed && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <div class="app-shell">
    <div ref="backgroundRef" class="app-shell__background" aria-hidden="true">
      <span class="app-shell__aurora app-shell__aurora--a"></span>
      <span class="app-shell__aurora app-shell__aurora--b"></span>
      <span class="app-shell__aurora app-shell__aurora--c"></span>
      <span class="app-shell__spotlight"></span>
      <span class="app-shell__grid"></span>
    </div>

    <div class="app-shell__content">
      <AppHeader
        :brand-name="t.brandName"
        :language-label="t.languageLabel"
        :experience-label="t.navExperience"
        :skills-label="t.navSkills"
        :projects-label="t.navProjects"
        :contact-label="t.navContact"
        :is-dark="isDarkTheme"
        :current-locale="locale"
        @toggle-theme="toggleTheme"
        @change-locale="changeLocale"
      />

      <main class="app-shell__main page-enter">
        <slot />
      </main>

      <AppFooter
        :brand-name="t.brandName"
        :tagline="t.footerTagline"
        :contact-title="t.footerContactTitle"
        :follow-title="t.footerFollowTitle"
        :location="t.footerLocation"
        :copy="t.footerCopy"
        :tools-label="t.navTools"
      />
    </div>

    <Transition name="back-to-top">
      <button v-if="showBackToTop" class="app-back-to-top" type="button" :aria-label="t.backToTopLabel" @click="scrollToTop">
        <span aria-hidden="true">↑</span>
      </button>
    </Transition>
  </div>
</template>
