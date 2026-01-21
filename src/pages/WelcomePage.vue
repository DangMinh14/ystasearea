<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WelcomeScreen from '../components/WelcomeScreen.vue'
import { translations, type Locale } from '../content/translations'
import bgVideo from '../assets/bg.mp4'
import '../components/PageShell.css'

const router = useRouter()
const locale = (localStorage.getItem('ystasearea-locale') as Locale) || 'vi'
const t = translations[locale] ?? translations.vi

const WELCOME_KEY = 'ystasearea-welcome-seen'

const enterSite = () => {
  localStorage.setItem(WELCOME_KEY, 'true')
  router.push('/home')
}

onMounted(() => {
  const seen = localStorage.getItem(WELCOME_KEY)
  if (seen === 'true') {
    router.replace('/home')
  }
})
</script>

<template>
  <main class="app">
    <div class="app__background" aria-hidden="true">
      <video class="app__video" :src="bgVideo" autoplay muted loop playsinline></video>
    </div>
    <div class="app__overlay" aria-hidden="true"></div>
    <WelcomeScreen :badge="t.welcomeBadge" :title="t.welcomeTitle" :subtitle="t.welcomeSubtitle" @enter="enterSite" />
  </main>
</template>
