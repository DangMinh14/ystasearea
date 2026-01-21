<script setup lang="ts">
import './MainLayout.css'

const emit = defineEmits<{
  (e: 'hello'): void
  (e: 'next-video'): void
  (e: 'prev-video'): void
  (e: 'select-video', index: number): void
  (e: 'refresh-cat'): void
  (e: 'refresh-dog'): void
}>()

type MainLayoutProps = {
  catImageUrl: string
  catTitle: string
  catButton: string
  catLoading: boolean
  catLoadingText: string
  dogImageUrl: string
  dogTitle: string
  dogButton: string
  dogLoading: boolean
  dogLoadingText: string
  dailyQuoteTitle: string
  dailyQuoteLoading: string
  dailyQuoteError: string
  quote: { content: string; author: string } | null
  quoteLoading: boolean
  quoteError: string
  musicTitle: string
  musicText: string
  playerPrev: string
  playerNext: string
  playlistLabel: string
  playlist: { id: string; title: string }[]
  currentVideoIndex: number
}

defineProps<MainLayoutProps>()

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
    <div class="layout__body">
      <aside class="layout__sidebar">
        <div class="layout__cat" id="contact">
          <div class="layout__cat-header">
            <p class="layout__cat-title">{{ catTitle }}</p>
            <button class="layout__cat-button" type="button" @click="emit('refresh-cat')">
              {{ catButton }}
            </button>
          </div>
          <div v-if="catLoading" class="layout__cat-loading">
            <span class="layout__cat-spinner" aria-hidden="true"></span>
            <span class="layout__cat-loading-text">{{ catLoadingText }}</span>
          </div>
          <div v-else class="layout__cat-media">
            <div v-if="!catImageUrl" class="layout__cat-skeleton"></div>
            <img
              v-else
              class="layout__cat-image"
              :src="catImageUrl"
              alt="Random cat"
              loading="lazy"
            />
          </div>
        </div>
        <div class="layout__cat layout__cat--dog">
          <div class="layout__cat-header">
            <p class="layout__cat-title">{{ dogTitle }}</p>
            <button class="layout__cat-button" type="button" @click="emit('refresh-dog')">
              {{ dogButton }}
            </button>
          </div>
          <div v-if="dogLoading" class="layout__cat-loading">
            <span class="layout__cat-spinner" aria-hidden="true"></span>
            <span class="layout__cat-loading-text">{{ dogLoadingText }}</span>
          </div>
          <div v-else class="layout__cat-media">
            <div v-if="!dogImageUrl" class="layout__cat-skeleton"></div>
            <img
              v-else
              class="layout__cat-image"
              :src="dogImageUrl"
              alt="Random dog"
              loading="lazy"
            />
          </div>
        </div>
      </aside>

      <section class="layout__content">
        <article class="layout__card layout__quote" id="posts">
          <h2 class="layout__card-title">{{ dailyQuoteTitle }}</h2>
          <p v-if="quoteLoading" class="layout__card-text">{{ dailyQuoteLoading }}</p>
          <p v-else-if="quoteError" class="layout__card-text">{{ dailyQuoteError }}</p>
          <div v-else-if="quote" class="layout__quote-body">
            <p class="layout__quote-text">“{{ quote.content }}”</p>
            <p class="layout__quote-author">— {{ quote.author }}</p>
          </div>
        </article>
        <article class="layout__card" id="projects">
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
  </section>
</template>
