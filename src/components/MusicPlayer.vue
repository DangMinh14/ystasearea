<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import './MusicPlayer.css'

type Track = {
  title: string
  url: string
}

type PlayerProps = {
  tracks: Track[]
}

const props = defineProps<PlayerProps>()

const audioRef = ref<HTMLAudioElement | null>(null)
const currentIndex = ref(0)
const isPlaying = ref(false)
const isShuffle = ref(false)
const repeatMode = ref<'off' | 'all' | 'one'>('all')
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isListOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const currentTrack = computed(() => props.tracks[currentIndex.value])
const progress = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

const formatTime = (value: number) => {
  if (!value || Number.isNaN(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const elapsedLabel = computed(() => formatTime(currentTime.value))
const durationLabel = computed(() => formatTime(duration.value))

const syncAudio = () => {
  const audio = audioRef.value
  if (!audio || !currentTrack.value) return
  audio.src = currentTrack.value.url
  audio.load()
  if (isPlaying.value) {
    audio.play()
  }
}

const togglePlay = () => {
  const audio = audioRef.value
  if (!audio) return
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {
    audio.play()
    isPlaying.value = true
  }
}

const stop = () => {
  const audio = audioRef.value
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
  isPlaying.value = false
}

const pickNextIndex = (direction: 'next' | 'prev') => {
  if (!props.tracks.length) return 0
  if (isShuffle.value) {
    const next = Math.floor(Math.random() * props.tracks.length)
    return next
  }

  if (direction === 'next') {
    return (currentIndex.value + 1) % props.tracks.length
  }

  return (currentIndex.value - 1 + props.tracks.length) % props.tracks.length
}

const nextTrack = () => {
  currentIndex.value = pickNextIndex('next')
}

const prevTrack = () => {
  currentIndex.value = pickNextIndex('prev')
}

const toggleShuffle = () => {
  isShuffle.value = !isShuffle.value
}

const cycleRepeat = () => {
  repeatMode.value = repeatMode.value === 'off' ? 'all' : repeatMode.value === 'all' ? 'one' : 'off'
}

const handleTimeUpdate = () => {
  const audio = audioRef.value
  if (!audio) return
  currentTime.value = audio.currentTime
  duration.value = audio.duration || 0
}

const handleSeek = (event: Event) => {
  const audio = audioRef.value
  if (!audio) return
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  audio.currentTime = (value / 100) * (duration.value || 0)
}

const handleVolume = (event: Event) => {
  const audio = audioRef.value
  if (!audio) return
  const target = event.target as HTMLInputElement
  volume.value = Number(target.value)
  audio.volume = volume.value
}

const handleEnded = () => {
  if (repeatMode.value === 'one') {
    const audio = audioRef.value
    if (audio) {
      audio.currentTime = 0
      audio.play()
      isPlaying.value = true
    }
    return
  }

  if (repeatMode.value === 'off' && currentIndex.value === props.tracks.length - 1) {
    isPlaying.value = false
    return
  }

  nextTrack()
}

const toggleList = () => {
  isListOpen.value = !isListOpen.value
}

const selectTrack = (index: number) => {
  currentIndex.value = index
  isPlaying.value = true
  isListOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (!rootRef.value) return
  if (!rootRef.value.contains(event.target as Node)) {
    isListOpen.value = false
  }
}

watch(currentIndex, () => {
  syncAudio()
})

watch(
  () => props.tracks,
  () => {
    if (currentIndex.value >= props.tracks.length) {
      currentIndex.value = 0
    }
    syncAudio()
  }
)

onMounted(() => {
  const audio = audioRef.value
  if (audio) {
    audio.volume = volume.value
  }
  syncAudio()
  document.addEventListener('click', handleClickOutside)
  if (audio) {
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="player">
    <audio ref="audioRef" @timeupdate="handleTimeUpdate" @loadedmetadata="handleTimeUpdate" @ended="handleEnded"></audio>
    <div class="player__info">
      <p class="player__title">
        {{ currentTrack?.title || 'No track' }}
      </p>
      <div class="player__progress">
        <input
          class="player__range"
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          @input="handleSeek"
        />
        <div class="player__time">
          <span>{{ elapsedLabel }}</span>
          <span>{{ durationLabel }}</span>
        </div>
      </div>
    </div>
    <div class="player__controls">
      <button
        class="player__button"
        type="button"
        :class="{ 'player__button--active': isShuffle }"
        title="Xáo trộn"
        @click="toggleShuffle"
      >
        <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
      </button>
      <button class="player__button" type="button" title="Bài trước" @click="prevTrack">
        <i class="fa-solid fa-backward" aria-hidden="true"></i>
      </button>
      <button
        class="player__button player__button--primary"
        type="button"
        :title="isPlaying ? 'Tạm dừng' : 'Phát'"
        @click="togglePlay"
      >
        <i class="fa-solid" :class="isPlaying ? 'fa-pause' : 'fa-play'" aria-hidden="true"></i>
      </button>
      <button class="player__button" type="button" title="Bài tiếp" @click="nextTrack">
        <i class="fa-solid fa-forward" aria-hidden="true"></i>
      </button>
      <button
        class="player__button"
        type="button"
        :class="{ 'player__button--active': repeatMode !== 'off' }"
        :title="repeatMode === 'one' ? 'Lặp 1 bài' : repeatMode === 'all' ? 'Lặp tất cả' : 'Không lặp'"
        @click="cycleRepeat"
      >
        <i class="fa-solid" :class="repeatMode === 'one' ? 'fa-1' : 'fa-repeat'" aria-hidden="true"></i>
      </button>
      <button class="player__button" type="button" title="Danh sách bài hát" @click="toggleList">
        <i class="fa-solid fa-list" aria-hidden="true"></i>
      </button>
    </div>
    <div class="player__volume">
      <i class="fa-solid fa-volume-high" aria-hidden="true"></i>
      <input class="player__range" type="range" min="0" max="1" step="0.01" :value="volume" @input="handleVolume" />
    </div>
    <div v-if="isListOpen" class="player__list">
      <button
        v-for="(track, index) in tracks"
        :key="track.url"
        class="player__list-item"
        :class="{ 'player__list-item--active': index === currentIndex }"
        type="button"
        @click="selectTrack(index)"
      >
        {{ track.title }}
      </button>
    </div>
  </div>
</template>
