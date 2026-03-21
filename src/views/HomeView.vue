<script setup lang="ts">
import { inject } from 'vue'
import UiButton from '../components/ui/UiButton.vue'
import UiCard from '../components/ui/UiCard.vue'
import UiSectionHeader from '../components/ui/UiSectionHeader.vue'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)

if (!shell) {
  throw new Error('HomeView requires shell context')
}
</script>

<template>
  <section class="home-view">
    <UiCard class="home-view__hero">
      <UiSectionHeader
        :eyebrow="shell.t.value.homeHeroEyebrow"
        :title="shell.t.value.homeHeroTitle"
        :subtitle="shell.t.value.homeHeroDescription"
      />
      <div class="home-view__hero-actions">
        <RouterLink to="/blog"><UiButton>{{ shell.t.value.navBlog }}</UiButton></RouterLink>
        <RouterLink to="/music"><UiButton variant="soft">{{ shell.t.value.navMusic }}</UiButton></RouterLink>
        <RouterLink to="/tools"><UiButton variant="soft">{{ shell.t.value.navTools }}</UiButton></RouterLink>
      </div>
    </UiCard>

    <div class="home-view__grid">
      <UiCard class="home-view__card">
        <h3>{{ shell.t.value.homeQuickExplore }}</h3>
        <p class="text-muted">Navigate quickly to your favorite sections.</p>
        <div class="home-view__link-grid">
          <RouterLink to="/blog"><UiButton variant="ghost" size="sm">{{ shell.t.value.navBlog }}</UiButton></RouterLink>
          <RouterLink to="/games"><UiButton variant="ghost" size="sm">{{ shell.t.value.navGames }}</UiButton></RouterLink>
          <RouterLink to="/music"><UiButton variant="ghost" size="sm">{{ shell.t.value.navMusic }}</UiButton></RouterLink>
          <RouterLink to="/tools"><UiButton variant="ghost" size="sm">{{ shell.t.value.navTools }}</UiButton></RouterLink>
        </div>
      </UiCard>

      <UiCard class="home-view__card">
        <h3>Featured Video</h3>
        <p class="text-muted">{{ shell.currentVideo.value.title }}</p>
        <div class="home-view__video">
          <iframe
            :src="`https://www.youtube.com/embed/${shell.currentVideo.value.id}`"
            title="Featured video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="home-view__hero-actions">
          <UiButton variant="soft" size="sm" @click="shell.onPrevVideo">Prev</UiButton>
          <UiButton size="sm" @click="shell.onNextVideo">Next</UiButton>
        </div>
      </UiCard>
    </div>
  </section>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: var(--space-4);
}

.home-view__hero {
  display: grid;
  gap: var(--space-4);
}

.home-view__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.home-view__grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

.home-view__card {
  display: grid;
  gap: var(--space-3);
}

.home-view__link-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.home-view__video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.home-view__video iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

@media (min-width: 768px) {
  .home-view__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
