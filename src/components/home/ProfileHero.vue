<script setup lang="ts">
import UiButton from '../ui/UiButton.vue'
import ProfileImage from './ProfileImage.vue'
import cvFile from '../../assets/documents/CV Nguyen Minh Dang - Software Engineer.pdf'

defineProps<{
  role: string
  name: string
  intro: string
  projectsLabel: string
  cvLabel: string
  imageAlt: string
  sectionLinks: Array<{ id: string; label: string }>
  available?: string
  location?: string
  experienceYears?: string
  experienceLabel?: string
}>()

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="profile-hero">
    <div class="profile-hero__content">
      <div v-if="available || location" class="profile-hero__meta">
        <span v-if="available" class="profile-hero__status">
          <span class="profile-hero__status-dot" aria-hidden="true"></span>
          {{ available }}
        </span>
        <span v-if="location" class="profile-hero__place">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          {{ location }}
        </span>
      </div>

      <p class="profile-hero__role text-eyebrow">{{ role }}</p>
      <h1 class="profile-hero__name">{{ name }}</h1>
      <p class="profile-hero__intro">{{ intro }}</p>

      <div v-if="experienceYears" class="profile-hero__stat">
        <span class="profile-hero__stat-value text-mono">{{ experienceYears }}</span>
        <span class="profile-hero__stat-label">{{ experienceLabel }}</span>
      </div>

      <div class="profile-hero__actions">
        <UiButton data-testid="profile-techstack-button" size="lg" @click="scrollToSection('portfolio')">
          {{ projectsLabel }}
        </UiButton>
        <a :href="cvFile" download="CV Nguyen Minh Dang - Software Engineer.pdf">
          <UiButton variant="ghost" size="lg">{{ cvLabel }}</UiButton>
        </a>
      </div>

      <div class="profile-hero__section-links" aria-label="Section quick links">
        <button
          v-for="section in sectionLinks"
          :key="section.id"
          data-testid="profile-section-chip"
          class="profile-hero__section-chip"
          type="button"
          @click="scrollToSection(section.id)"
        >
          {{ section.label }}
        </button>
      </div>
    </div>

    <ProfileImage :alt="imageAlt" />
  </section>
</template>

<style scoped>
.profile-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: clamp(var(--space-6), 4vw, var(--space-10));
  padding: clamp(var(--space-6), 3.8vw, var(--space-10));
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
  background:
    linear-gradient(140deg, color-mix(in srgb, var(--surface-1) 84%, transparent), color-mix(in srgb, var(--surface-2) 90%, transparent)),
    radial-gradient(120% 120% at 82% 0%, var(--accent-soft), transparent 46%);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

.profile-hero__content {
  display: grid;
  gap: var(--space-4);
  max-width: 560px;
}

.profile-hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.profile-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  color: var(--accent-color);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.02em;
}

.profile-hero__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-color) 70%, transparent);
  animation: status-pulse 2.4s ease-out infinite;
}

.profile-hero__place {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-secondary);
  font-size: 0.86rem;
}

.profile-hero__place i {
  color: var(--accent-color);
}

.profile-hero__role {
  margin: 0;
}

.profile-hero__name {
  font-size: clamp(2.2rem, 5.4vw, 4.2rem);
  line-height: 0.98;
}

.profile-hero__intro {
  color: var(--text-secondary);
  max-width: 52ch;
  font-size: clamp(1rem, 2vw, 1.12rem);
  line-height: 1.7;
}

.profile-hero__stat {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 16px;
  width: fit-content;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--accent-soft);
}

.profile-hero__stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
}

.profile-hero__stat-label {
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.profile-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-top: var(--space-2);
}

.profile-hero__section-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.profile-hero__section-chip {
  border: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--surface-3) 86%, transparent);
  color: var(--text-secondary);
  border-radius: var(--radius-pill);
  padding: 0.34rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform var(--motion-base) var(--ease-standard),
    color var(--motion-base) var(--ease-standard),
    border-color var(--motion-base) var(--ease-standard),
    background-color var(--motion-base) var(--ease-standard);
}

.profile-hero__section-chip:hover,
.profile-hero__section-chip:focus-visible {
  color: var(--accent-color);
  border-color: var(--accent-color);
  background: var(--accent-soft);
  transform: translateY(-2px);
  outline: none;
}

@keyframes status-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-color) 60%, transparent);
  }
  70% {
    box-shadow: 0 0 0 7px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

@media (min-width: 1024px) {
  .profile-hero {
    grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
    padding-block: clamp(var(--space-8), 5vw, var(--space-11));
  }
}

@media (max-width: 1023px) {
  .profile-hero {
    text-align: center;
    justify-items: center;
  }

  .profile-hero__content {
    max-width: 100%;
    justify-items: center;
  }

  .profile-hero__meta,
  .profile-hero__actions,
  .profile-hero__section-links {
    justify-content: center;
  }

  .profile-hero__stat {
    margin-inline: auto;
  }

  .profile-hero__intro {
    margin-inline: auto;
  }
}

@media (max-width: 480px) {
  .profile-hero {
    padding: var(--space-5) var(--space-4);
    border-radius: var(--radius-lg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-hero__status-dot {
    animation: none;
  }
}
</style>
