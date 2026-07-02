<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { translations, type Locale } from '../content/translations'

const router = useRouter()
const locale = (localStorage.getItem('ystasearea-locale') as Locale) || 'en'
const t = translations[locale] ?? translations.en

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
      <span class="welcome-view__aurora welcome-view__aurora--a"></span>
      <span class="welcome-view__aurora welcome-view__aurora--b"></span>
      <span class="welcome-view__aurora welcome-view__aurora--c"></span>
    </div>

    <section class="welcome-view__card surface">
      <p class="ui-badge">{{ t.welcomeBadge }}</p>
      <h1 class="welcome-view__title">{{ t.welcomeTitle }}</h1>
      <p class="text-body welcome-view__subtitle">{{ t.welcomeSubtitle }}</p>
      <span class="welcome-view__cta">
        {{ t.enterSiteLabel }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </span>
    </section>
  </main>
</template>

<style scoped>
.welcome-view {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: var(--background-primary);
}

.welcome-view__background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.welcome-view__aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
}

.welcome-view__aurora--a {
  width: 56vw;
  height: 56vw;
  top: -16vw;
  left: -10vw;
  background: radial-gradient(circle, var(--aurora-1), transparent 68%);
  animation: aurora-drift 28s ease-in-out infinite;
}

.welcome-view__aurora--b {
  width: 48vw;
  height: 48vw;
  bottom: -16vw;
  right: -10vw;
  background: radial-gradient(circle, var(--aurora-2), transparent 68%);
  animation: aurora-drift 34s ease-in-out infinite reverse;
}

.welcome-view__aurora--c {
  width: 38vw;
  height: 38vw;
  top: 30%;
  left: 40%;
  background: radial-gradient(circle, var(--aurora-3), transparent 70%);
  animation: aurora-drift 40s ease-in-out infinite;
}

.welcome-view__card {
  position: relative;
  z-index: 1;
  width: min(540px, 100%);
  text-align: center;
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  padding: var(--space-9) var(--space-7);
  border-radius: var(--radius-lg);
  animation: fade-slide-up var(--motion-slower) var(--ease-out);
}

.welcome-view__title {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
}

.welcome-view__subtitle {
  margin-inline: auto;
}

.welcome-view__cta {
  margin-top: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--accent-color);
  color: var(--accent-contrast);
  border-radius: var(--radius-pill);
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: var(--shadow-button);
  transition: transform var(--motion-base) var(--ease-standard),
    box-shadow var(--motion-base) var(--ease-standard);
}

.welcome-view__cta i {
  transition: transform var(--motion-base) var(--ease-standard);
}

.welcome-view:hover .welcome-view__cta {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.welcome-view:hover .welcome-view__cta i {
  transform: translateX(4px);
}

@media (prefers-reduced-motion: reduce) {
  .welcome-view__aurora {
    animation: none !important;
  }
}
</style>
