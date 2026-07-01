<script setup lang="ts">
import { CONTACT, SOCIALS } from '../../content/profile'

defineProps<{
  brandName: string
  tagline: string
  contactTitle: string
  followTitle: string
  location: string
  copy: string
  toolsLabel: string
}>()
</script>

<template>
  <footer class="app-footer surface">
    <div class="app-footer__grid">
      <div class="app-footer__brand-col">
        <div class="app-footer__brand">
          <span class="app-footer__mark" aria-hidden="true"></span>
          <strong>{{ brandName }}</strong>
        </div>
        <p class="app-footer__tagline">{{ tagline }}</p>
        <p class="app-footer__location">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          {{ location }}
        </p>
      </div>

      <div class="app-footer__col">
        <h4 class="app-footer__col-title">{{ contactTitle }}</h4>
        <a class="app-footer__contact-link" :href="CONTACT.phoneHref">
          <i class="fa-solid fa-phone" aria-hidden="true"></i>
          {{ CONTACT.phoneDisplay }}
        </a>
      </div>

      <div class="app-footer__col">
        <h4 class="app-footer__col-title">{{ followTitle }}</h4>
        <div class="app-footer__socials">
          <a
            v-for="social in SOCIALS"
            :key="social.id"
            class="app-footer__social"
            :href="social.url"
            target="_blank"
            rel="noreferrer noopener"
            :aria-label="social.label"
          >
            <i :class="social.icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="app-footer__bar">
      <p class="app-footer__copy">{{ copy }}</p>
      <div class="app-footer__meta">
        <span class="app-footer__built">Made with Vue + TypeScript</span>
        <RouterLink
          class="app-footer__secret"
          to="/tools"
          :aria-label="toolsLabel"
          title="?"
        >
          <i class="fa-solid fa-diamond" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: var(--space-9);
  padding: var(--space-8) clamp(var(--space-5), 4vw, var(--space-9));
  display: grid;
  gap: var(--space-7);
  border-radius: var(--radius-lg);
}

.app-footer__grid {
  display: grid;
  gap: var(--space-7);
  grid-template-columns: 1fr;
}

.app-footer__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1.1rem;
  color: var(--text-primary);
}

.app-footer__mark {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-strong));
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.app-footer__tagline {
  margin-top: var(--space-3);
  color: var(--text-secondary);
  max-width: 42ch;
  line-height: 1.6;
}

.app-footer__location {
  margin-top: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.app-footer__location i {
  color: var(--accent-color);
}

.app-footer__col-title {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
  font-weight: 500;
}

.app-footer__contact-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-weight: 500;
}

.app-footer__contact-link i {
  color: var(--accent-color);
}

.app-footer__contact-link:hover {
  color: var(--accent-color);
}

.app-footer__socials {
  display: flex;
  gap: var(--space-2);
}

.app-footer__social {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  color: var(--text-primary);
  font-size: 1rem;
  transition: transform var(--motion-base) var(--ease-standard),
    color var(--motion-base) var(--ease-standard),
    border-color var(--motion-base) var(--ease-standard),
    background-color var(--motion-base) var(--ease-standard);
}

.app-footer__social:hover {
  transform: translateY(-3px);
  color: var(--accent-color);
  border-color: var(--accent-color);
  background: var(--accent-soft);
}

.app-footer__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-subtle);
}

.app-footer__copy {
  color: var(--text-faint);
  font-size: 0.85rem;
}

.app-footer__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.app-footer__built {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-faint);
  letter-spacing: 0.02em;
}

/* The quiet door: barely there until you look for it. */
.app-footer__secret {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: var(--text-faint);
  opacity: 0.28;
  font-size: 0.6rem;
  transition: opacity var(--motion-base) var(--ease-standard),
    color var(--motion-base) var(--ease-standard),
    transform var(--motion-base) var(--ease-spring);
}

.app-footer__secret:hover,
.app-footer__secret:focus-visible {
  opacity: 1;
  color: var(--accent-color);
  transform: rotate(45deg) scale(1.15);
  outline: none;
}

@media (min-width: 720px) {
  .app-footer__grid {
    grid-template-columns: 2fr 1fr 1fr;
    align-items: start;
  }
}
</style>
