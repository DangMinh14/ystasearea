<script setup lang="ts">
import UiButton from '../ui/UiButton.vue'
import ProfileImage from './ProfileImage.vue'

defineProps<{
  role: string
  name: string
  intro: string
  projectsLabel: string
  cvLabel: string
  imageAlt: string
}>()
</script>

<template>
  <section class="profile-hero">
    <div class="profile-hero__content">
      <p class="profile-hero__role text-eyebrow">{{ role }}</p>
      <h1 class="profile-hero__name">{{ name }}</h1>
      <p class="profile-hero__intro">{{ intro }}</p>
      <div class="profile-hero__actions">
        <RouterLink to="/tools">
          <UiButton size="lg">{{ projectsLabel }}</UiButton>
        </RouterLink>
        <RouterLink to="/tools/cv-generator">
          <UiButton variant="ghost" size="lg">{{ cvLabel }}</UiButton>
        </RouterLink>
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
