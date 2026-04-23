<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { translations, type Locale } from '../content/translations'
import bgVideo from '../assets/videos/bg.mp4'
import '../components/layout/app-layout.css'

const router = useRouter()
const locale = (localStorage.getItem('ystasearea-locale') as Locale) || 'vi'
const t = translations[locale] ?? translations.vi

const WELCOME_KEY = 'ystasearea-welcome-seen'

const enterSite = () => {
  localStorage.setItem(WELCOME_KEY, 'true')
  router.push('/home')
}

onMounted(() => {
  if (localStorage.getItem(WELCOME_KEY) === 'true') {
    router.replace('/home')
  }
})
</script>

<template>
  <main class="welcome-view" role="button" tabindex="0" @click="enterSite" @keydown.enter="enterSite">
    <div class="welcome-view__background" aria-hidden="true">
      <video :src="bgVideo" autoplay muted loop playsinline></video>
    </div>
    <div class="welcome-view__overlay" aria-hidden="true"></div>

    <section class="welcome-view__card surface">
      <p class="ui-badge">{{ t.welcomeBadge }}</p>
      <h1>{{ t.welcomeTitle }}</h1>
      <p class="text-muted">{{ t.welcomeSubtitle }}</p>
      <span class="welcome-view__cta">{{ t.enterSiteLabel }}</span>
    </section>
  </main>
</template>

<style scoped>
.welcome-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--space-6);
  position: relative;
  cursor: pointer;
}

.welcome-view__background,
.welcome-view__overlay {
  position: absolute;
  inset: 0;
}

.welcome-view__background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.welcome-view__overlay {
  background: rgba(12, 10, 30, 0.35);
}

.welcome-view__card {
  position: relative;
  z-index: 1;
  width: min(560px, 100%);
  text-align: center;
  display: grid;
  gap: var(--space-3);
  padding: var(--space-7);
}

.welcome-view__cta {
  margin-top: var(--space-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-3);
  border-radius: var(--radius-pill);
  padding: 10px 16px;
  font-weight: 600;
}
</style>
