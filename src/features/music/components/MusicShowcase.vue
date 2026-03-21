<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiCard from '../../../components/ui/UiCard.vue'
import UiModal from '../../../components/ui/UiModal.vue'
import UiSectionHeader from '../../../components/ui/UiSectionHeader.vue'
import type { Mp3Track, PlaylistVideo } from '../../../composables/usePlaylist'
import './music.css'

const props = defineProps<{
  title: string
  subtitle: string
  tracks: Mp3Track[]
  playlist: PlaylistVideo[]
  currentVideoIndex: number
}>()

const emit = defineEmits<{
  (e: 'prev-video'): void
  (e: 'next-video'): void
  (e: 'select-video', index: number): void
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const isPlaylistOpen = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const currentTrack = computed(() => props.tracks[currentTrackIndex.value])
const currentVideo = computed(() => props.playlist[props.currentVideoIndex])
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})
const thumbnailUrl = computed(() => {
  if (!currentVideo.value) return ''
  return `https://img.youtube.com/vi/${currentVideo.value.id}/mqdefault.jpg`
})

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) {
    return '0:00'
  }

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const elapsedLabel = computed(() => formatTime(currentTime.value))
const durationLabel = computed(() => formatTime(duration.value))

const syncTrack = () => {
  const audio = audioRef.value
  if (!audio || !currentTrack.value) return

  audio.src = currentTrack.value.url
  audio.load()
  currentTime.value = 0
  duration.value = 0

  if (isPlaying.value) {
    audio.play().catch(() => {
      isPlaying.value = false
    })
  }
}

watch(currentTrack, () => {
  syncTrack()
})

onMounted(() => {
  syncTrack()
})

const togglePlay = () => {
  const audio = audioRef.value
  if (!audio) return

  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
    return
  }

  audio.play().then(() => {
    isPlaying.value = true
  }).catch(() => {
    isPlaying.value = false
  })
}

const nextTrack = () => {
  if (!props.tracks.length) return
  currentTrackIndex.value = (currentTrackIndex.value + 1) % props.tracks.length
}

const prevTrack = () => {
  if (!props.tracks.length) return
  currentTrackIndex.value = (currentTrackIndex.value - 1 + props.tracks.length) % props.tracks.length
}

const replayTrack = () => {
  const audio = audioRef.value
  if (!audio) return
  audio.currentTime = 0
  currentTime.value = 0
  if (!isPlaying.value) {
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
}

const handleTimeUpdate = () => {
  const audio = audioRef.value
  if (!audio) return
  currentTime.value = audio.currentTime
  duration.value = audio.duration || 0
}

const handleSeek = (event: Event) => {
  const audio = audioRef.value
  if (!audio || !duration.value) return
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  audio.currentTime = (value / 100) * duration.value
  currentTime.value = audio.currentTime
}

const selectTrack = (index: number) => {
  currentTrackIndex.value = index
  isPlaylistOpen.value = false
  if (!isPlaying.value) {
    const audio = audioRef.value
    if (!audio) return
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
}
</script>

<template>
  <section class="music">
    <UiSectionHeader eyebrow="Music" :title="title" :subtitle="subtitle" />

    <UiCard class="music__player-card">
      <audio ref="audioRef" @timeupdate="handleTimeUpdate" @loadedmetadata="handleTimeUpdate" @ended="nextTrack"></audio>
      <div class="music__top">
        <img v-if="thumbnailUrl" :src="thumbnailUrl" class="music__thumb" alt="Track thumbnail" loading="lazy" />
        <div class="music__meta">
          <p class="text-eyebrow">Now playing</p>
          <h3 class="music__title">{{ currentTrack?.title || 'No track available' }}</h3>
          <p class="text-muted">Personal soundtrack session</p>
        </div>
      </div>

      <div class="music__timeline">
        <input
          class="music__progress"
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          aria-label="Seek audio progress"
          @input="handleSeek"
        />
        <div class="music__time-row">
          <span>{{ elapsedLabel }}</span>
          <span>{{ durationLabel }}</span>
        </div>
      </div>

      <div class="music__transport" role="group" aria-label="Audio controls">
        <UiButton variant="soft" size="sm" @click="prevTrack">
          <i class="fa-solid fa-backward" aria-hidden="true"></i>
          Prev
        </UiButton>
        <UiButton size="sm" @click="togglePlay">
          <i class="fa-solid" :class="isPlaying ? 'fa-pause' : 'fa-play'" aria-hidden="true"></i>
          {{ isPlaying ? 'Pause' : 'Play' }}
        </UiButton>
        <UiButton variant="soft" size="sm" @click="nextTrack">
          Next
          <i class="fa-solid fa-forward" aria-hidden="true"></i>
        </UiButton>
        <UiButton variant="ghost" size="sm" @click="replayTrack">
          <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
          Replay
        </UiButton>
        <UiButton variant="ghost" size="sm" @click="isPlaylistOpen = true">
          <i class="fa-solid fa-list" aria-hidden="true"></i>
          Playlist
        </UiButton>
      </div>
    </UiCard>

    <UiCard class="music__video-card">
      <div class="music__video-header">
        <h3>Featured videos</h3>
        <div class="music__video-actions">
          <UiButton variant="soft" size="sm" @click="emit('prev-video')">Prev video</UiButton>
          <UiButton size="sm" @click="emit('next-video')">Next video</UiButton>
        </div>
      </div>
      <div class="music__video-frame">
        <iframe
          :src="`https://www.youtube.com/embed/${currentVideo?.id}`"
          title="YouTube player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <div class="music__video-grid">
        <button
          v-for="(video, index) in playlist"
          :key="video.id"
          class="music__video-item"
          :class="{ 'music__video-item--active': index === currentVideoIndex }"
          type="button"
          @click="emit('select-video', index)"
        >
          <img :src="`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`" :alt="video.title" loading="lazy" />
          <span>{{ video.title }}</span>
        </button>
      </div>
    </UiCard>

    <UiModal v-model="isPlaylistOpen" aria-label="Playlist">
      <div class="music__playlist-modal">
        <div class="music__video-header">
          <h3>Playlist</h3>
          <UiButton variant="ghost" size="sm" @click="isPlaylistOpen = false">Close</UiButton>
        </div>
        <div class="music__playlist-list">
          <button
            v-for="(track, index) in tracks"
            :key="track.url"
            class="music__playlist-item"
            :class="{ 'music__playlist-item--active': index === currentTrackIndex }"
            type="button"
            @click="selectTrack(index)"
          >
            {{ track.title }}
          </button>
        </div>
      </div>
    </UiModal>
  </section>
</template>
