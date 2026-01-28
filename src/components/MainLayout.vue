<script setup lang="ts">
import { inject } from 'vue'
import GameHub from './GameHub.vue'
import './MainLayout.css'
import { pageShellContextKey, type PageShellContext } from '../composables/pageShellContext'

const shell = inject<PageShellContext>(pageShellContextKey)

if (!shell) {
  throw new Error('MainLayout requires PageShell context.')
}

const nextVideo = () => {
  shell.onNextVideo()
}

const prevVideo = () => {
  shell.onPrevVideo()
}

const selectVideo = (index: number) => {
  shell.onSelectVideo(index)
}
</script>

<template>
  <section class="layout">
    <div class="layout__body">
      <aside class="layout__sidebar">
        <div class="layout__cat" id="contact">
          <div class="layout__cat-header">
            <p class="layout__cat-title">{{ shell.catTitle.value }}</p>
            <button class="layout__cat-button" type="button" @click="shell.onRefreshCat">
              {{ shell.catButton.value }}
            </button>
          </div>
          <div v-if="shell.catLoading.value" class="layout__cat-loading">
            <span class="layout__cat-spinner" aria-hidden="true"></span>
            <span class="layout__cat-loading-text">{{ shell.catLoadingText.value }}</span>
          </div>
          <div v-else class="layout__cat-media">
            <div v-if="!shell.catImageUrl.value" class="layout__cat-skeleton"></div>
            <img
              v-else
              class="layout__cat-image"
              :src="shell.catImageUrl.value"
              alt="Random cat"
              loading="lazy"
            />
          </div>
        </div>
        <div class="layout__cat layout__cat--dog">
          <div class="layout__cat-header">
            <p class="layout__cat-title">{{ shell.dogTitle.value }}</p>
            <button class="layout__cat-button" type="button" @click="shell.onRefreshDog">
              {{ shell.dogButton.value }}
            </button>
          </div>
          <div v-if="shell.dogLoading.value" class="layout__cat-loading">
            <span class="layout__cat-spinner" aria-hidden="true"></span>
            <span class="layout__cat-loading-text">{{ shell.dogLoadingText.value }}</span>
          </div>
          <div v-else class="layout__cat-media">
            <div v-if="!shell.dogImageUrl.value" class="layout__cat-skeleton"></div>
            <img
              v-else
              class="layout__cat-image"
              :src="shell.dogImageUrl.value"
              alt="Random dog"
              loading="lazy"
            />
          </div>
        </div>
      </aside>

      <section class="layout__content">
        <article class="layout__card layout__quote" id="posts">
          <h2 class="layout__card-title">{{ shell.dailyQuoteTitle.value }}</h2>
          <p v-if="shell.quoteLoading.value" class="layout__card-text">
            {{ shell.dailyQuoteLoading.value }}
          </p>
          <p v-else-if="shell.quoteError.value" class="layout__card-text">
            {{ shell.dailyQuoteError.value }}
          </p>
          <div v-else-if="shell.quote.value" class="layout__quote-body">
            <p class="layout__quote-text">“{{ shell.quote.value.content }}”</p>
            <p class="layout__quote-author">— {{ shell.quote.value.author }}</p>
          </div>
        </article>
        <article class="layout__card">
          <GameHub />
        </article>
        <article class="layout__card" id="projects">
          <h2 class="layout__card-title">{{ shell.musicTitle.value }}</h2>
          <p class="layout__card-text">{{ shell.musicText.value }}</p>
          <div class="layout__player-controls">
            <button class="layout__button layout__button--ghost" type="button" @click="prevVideo">
              {{ shell.playerPrev.value }}
            </button>
            <button class="layout__button layout__button--primary" type="button" @click="nextVideo">
              {{ shell.playerNext.value }}
            </button>
          </div>
          <div class="layout__player">
            <iframe
              :src="`https://www.youtube.com/embed/${shell.playlist[shell.currentVideoIndex.value]?.id}`"
              title="YouTube music player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <div class="layout__playlist">
            <p class="layout__playlist-title">{{ shell.playlistLabel.value }}</p>
            <div class="layout__playlist-grid">
              <button
                v-for="(video, index) in shell.playlist"
                :key="video.id"
                class="layout__playlist-item"
                type="button"
                :aria-pressed="index === shell.currentVideoIndex.value"
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
