<script setup lang="ts">
import './MainLayout.css'

const emit = defineEmits<{
  (e: 'hello'): void
  (e: 'next-video'): void
  (e: 'prev-video'): void
  (e: 'select-video', index: number): void
}>()

type MainLayoutProps = {
  headerEyebrow: string
  headerTitle: string
  navHome: string
  navPosts: string
  navProjects: string
  navContact: string
  musicTitle: string
  musicText: string
  playerPrev: string
  playerNext: string
  playlistLabel: string
  playlist: { id: string; title: string }[]
  currentVideoIndex: number
  footerCopy: string
  footerButton: string
}

defineProps<MainLayoutProps>()

const sayHello = () => {
  emit('hello')
}

const nextVideo = () => {
  emit('next-video')
}

const prevVideo = () => {
  emit('prev-video')
}

const selectVideo = (index: number) => {
  emit('select-video', index)
}
</script>

<template>
  <section class="layout">
    <slot name="settings" />

    <header class="layout__header">
      <div>
        <p class="layout__eyebrow">{{ headerEyebrow }}</p>
        <h1 class="layout__title">{{ headerTitle }}</h1>
      </div>
    </header>

    <div class="layout__body">
      <aside class="layout__sidebar">
        <nav class="layout__nav">
          <a class="layout__nav-link" href="#">{{ navHome }}</a>
          <a class="layout__nav-link" href="#">{{ navPosts }}</a>
          <a class="layout__nav-link" href="#">{{ navProjects }}</a>
          <a class="layout__nav-link" href="#">{{ navContact }}</a>
        </nav>
      </aside>

      <section class="layout__content">
        <article class="layout__card">
          <h2 class="layout__card-title">{{ musicTitle }}</h2>
          <p class="layout__card-text">{{ musicText }}</p>
          <div class="layout__player-controls">
            <button class="layout__button layout__button--ghost" type="button" @click="prevVideo">
              {{ playerPrev }}
            </button>
            <button class="layout__button layout__button--primary" type="button" @click="nextVideo">
              {{ playerNext }}
            </button>
          </div>
          <div class="layout__player">
            <iframe
              :src="`https://www.youtube.com/embed/${playlist[currentVideoIndex]?.id}`"
              title="YouTube music player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <div class="layout__playlist">
            <p class="layout__playlist-title">{{ playlistLabel }}</p>
            <div class="layout__playlist-grid">
              <button
                v-for="(video, index) in playlist"
                :key="video.id"
                class="layout__playlist-item"
                type="button"
                :aria-pressed="index === currentVideoIndex"
                @click="selectVideo(index)"
              >
                <img
                  class="layout__playlist-thumb"
                  :src="`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`"
                  :alt="video.title"
                  loading="lazy"
                />
                <span class="layout__playlist-name">{{ video.title }}</span>
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>

    <footer class="layout__footer">
      <span>{{ footerCopy }}</span>
      <button class="layout__button layout__button--primary" type="button" @click="sayHello">
        {{ footerButton }}
      </button>
    </footer>
  </section>
</template>
