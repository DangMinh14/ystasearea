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
}>()

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="profile-hero">
    <div class="profile-hero__content">
      <p class="profile-hero__role text-eyebrow">{{ role }}</p>
      <h1 class="profile-hero__name">{{ name }}</h1>
      <p class="profile-hero__intro">{{ intro }}</p>
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
  min-height: min(74vh, 720px);
  padding: clamp(var(--space-6), 3.8vw, var(--space-10));
  border-radius: var(--radius-xl);
  background:
    linear-gradient(132deg, color-mix(in srgb, var(--surface-1) 82%, transparent), color-mix(in srgb, var(--surface-2) 88%, transparent)),
    linear-gradient(24deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 52%);
  box-shadow: none;
}

.profile-hero__content {
  display: grid;
  gap: var(--space-4);
  max-width: 560px;
}

.profile-hero__role {
  margin: 0;
}

.profile-hero__name {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.95;
}

.profile-hero__intro {
  color: var(--text-secondary);
  max-width: 52ch;
  font-size: clamp(1rem, 2vw, 1.12rem);
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
  padding: 0.32rem 0.7rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.profile-hero__section-chip:hover,
.profile-hero__section-chip:focus-visible {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--accent) 52%, transparent);
}

@media (min-width: 1024px) {
  .profile-hero {
    grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
    padding-block: clamp(var(--space-7), 5.2vw, var(--space-11));
  }

  .profile-hero__content {
    padding-left: clamp(var(--space-2), 2vw, var(--space-6));
  }
}
</style>
