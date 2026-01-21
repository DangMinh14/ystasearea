<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import MainLayout from './MainLayout.vue'
import MusicPlayer from './MusicPlayer.vue'
import SettingsMenu from './SettingsMenu.vue'
import { translations, type Locale } from '../content/translations'
import bgVideo from '../assets/bg.mp4'
import chibi from '../assets/chibi.png'
import './PageShell.css'

const THEME_KEY = 'ystasearea-theme'
const LOCALE_KEY = 'ystasearea-locale'

const theme = ref<'dark' | 'light' | 'christmas' | 'lunar' | 'halloween'>('dark')
const locale = ref<Locale>('vi')
const currentVideoIndex = ref(0)
const catImageUrl = ref('')
const catLoading = ref(false)
const quote = ref<{ content: string; author: string } | null>(null)
const quoteLoading = ref(false)
const quoteError = ref('')
const now = ref(new Date())
const timeZone = ref('Asia/Ho_Chi_Minh')
const weatherLocation = ref('hcm')
const weatherLoading = ref(false)
const weatherError = ref('')
const weather = ref<{ temperature: number; wind: number } | null>(null)
const isNavOpen = ref(false)

const timeZones = [
  { value: 'Asia/Ho_Chi_Minh', label: 'GMT+7 (Ho Chi Minh)' },
  { value: 'Asia/Bangkok', label: 'GMT+7 (Bangkok)' },
  { value: 'Asia/Singapore', label: 'GMT+8 (Singapore)' },
  { value: 'Asia/Tokyo', label: 'GMT+9 (Tokyo)' },
  { value: 'UTC', label: 'UTC' },
]

const weatherLocations = [
  { value: 'hcm', label: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { value: 'hanoi', label: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { value: 'danang', label: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { value: 'cantho', label: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
  { value: 'haiphong', label: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
]

const playlist = [
  { id: '8scL5oJX6CM', title: 'Cigarettes After Sex Playlist' },
  { id: 'tbfumVRH7Ls', title: 'Hoa - Doãn Hoài Nam' },
  { id: 'SO_zCJkZdkY', title: 'Mơ - Doãn Hoài Nam' },
  { id: 'f3jlAJ6CxDo', title: 'Bóng - Doãn Hoài Nam' },
]

const mp3Modules = import.meta.glob('../assets/mp3/*.mp3', { eager: true, as: 'url' })
const mp3Tracks = Object.entries(mp3Modules)
  .map(([path, url]) => {
    const fileName = decodeURIComponent(path.split('/').pop() ?? '')
    const title = fileName.replace(/\.mp3$/i, '').replace(/_/g, ' ').trim()
    return { title, url }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

const t = computed(() => translations[locale.value])

const formattedTime = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
    timeZone: timeZone.value,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now.value)
)

const formattedDate = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
    timeZone: timeZone.value,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now.value)
)

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', theme.value)
}

const setTheme = (nextTheme: 'dark' | 'light' | 'christmas' | 'lunar' | 'halloween') => {
  theme.value = nextTheme
  applyTheme()
  localStorage.setItem(THEME_KEY, nextTheme)
}

const changeLocale = (nextLocale: Locale) => {
  locale.value = nextLocale
  localStorage.setItem(LOCALE_KEY, nextLocale)
}

const handleTimeZoneChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  timeZone.value = target.value
}

const handleWeatherLocationChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  weatherLocation.value = target.value
}

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}


const goNextVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % playlist.length
}

const goPrevVideo = () => {
  currentVideoIndex.value =
    (currentVideoIndex.value - 1 + playlist.length) % playlist.length
}
const selectVideo = (index: number) => {
  currentVideoIndex.value = index
}

const hello = () => {
  alert('Xin chào từ ystasearea.space!')
}

const loadCatImage = async () => {
  catLoading.value = true
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search')
    if (!response.ok) {
      throw new Error('Cat request failed')
    }
    const data = await response.json()
    if (Array.isArray(data) && data[0]?.url) {
      catImageUrl.value = data[0].url
    }
  } catch (error) {
    catImageUrl.value = ''
  } finally {
    catLoading.value = false
  }
}

const loadDailyQuote = async () => {
  quoteLoading.value = true
  quoteError.value = ''
  try {
    const response = await fetch('/api/quote')
    if (!response.ok) {
      throw new Error('Quote request failed')
    }
    const data = await response.json()
    if (Array.isArray(data)) {
      const first = data[0]
      if (!first?.q) {
        throw new Error('Invalid quote payload')
      }
      quote.value = { content: first.q, author: first.a ?? 'Unknown' }
      return
    }

    if (!data?.content) {
      throw new Error('Invalid quote payload')
    }

    quote.value = { content: data.content, author: data.author ?? 'Unknown' }
  } catch (error) {
    quoteError.value = 'error'
  } finally {
    quoteLoading.value = false
  }
}

const loadWeather = async () => {
  weatherLoading.value = true
  weatherError.value = ''
  const location = weatherLocations.find((item) => item.value === weatherLocation.value)
  if (!location) {
    weatherLoading.value = false
    weatherError.value = 'error'
    return
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(location.lat))
    url.searchParams.set('longitude', String(location.lon))
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m')
    url.searchParams.set('timezone', 'auto')

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('Weather request failed')
    }

    const data = await response.json()
    const current = data?.current
    if (!current) {
      throw new Error('Invalid weather payload')
    }

    weather.value = {
      temperature: current.temperature_2m,
      wind: current.wind_speed_10m,
    }
  } catch (error) {
    weatherError.value = 'error'
    weather.value = null
  } finally {
    weatherLoading.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (
    savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'christmas' ||
    savedTheme === 'lunar' ||
    savedTheme === 'halloween'
  ) {
    theme.value = savedTheme
  }
  const savedLocale = localStorage.getItem(LOCALE_KEY)
  if (savedLocale === 'en' || savedLocale === 'vi') {
    locale.value = savedLocale
  }
  applyTheme()
  loadDailyQuote()
  loadCatImage()
  loadWeather()
})

const timer = window.setInterval(() => {
  now.value = new Date()
}, 1000)

onUnmounted(() => {
  window.clearInterval(timer)
})

watch(weatherLocation, () => {
  loadWeather()
})
</script>

<template>
  <main class="app" id="home">
    <div class="app__background" aria-hidden="true">
      <video class="app__video" :src="bgVideo" autoplay muted loop playsinline></video>
    </div>
    <div class="app__overlay" aria-hidden="true"></div>
    <div class="app__decorations app__decorations--lunar" aria-hidden="true">
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
      <span class="app__petal"></span>
    </div>
    <div class="app__decorations app__decorations--halloween" aria-hidden="true">
      <span class="app__halloween-item">🎃</span>
      <span class="app__halloween-item">🕸️</span>
      <span class="app__halloween-item">💀</span>
      <span class="app__halloween-item">🕷️</span>
      <span class="app__halloween-item">🕸️</span>
      <span class="app__halloween-item">🎃</span>
      <span class="app__halloween-item">🕷️</span>
      <span class="app__halloween-item">💀</span>
      <span class="app__halloween-item">🎃</span>
      <span class="app__halloween-item">🕸️</span>
    </div>
    <div class="app__decorations app__decorations--christmas" aria-hidden="true">
      <span class="app__christmas-item">❄️</span>
      <span class="app__christmas-item">✨</span>
      <span class="app__christmas-item">🎁</span>
      <span class="app__christmas-item">🎄</span>
      <span class="app__christmas-item">⭐</span>
      <span class="app__christmas-item">❄️</span>
      <span class="app__christmas-item">✨</span>
      <span class="app__christmas-item">🎁</span>
      <span class="app__christmas-item">⭐</span>
    </div>
    <img class="app__chibi" :src="chibi" alt="Chibi decoration" loading="lazy" />
    <aside class="app__widget app__widget--left">
      <div class="app__widget-header">
        <i class="fa-solid fa-clock" aria-hidden="true"></i>
        <h2 class="app__widget-title">{{ t.clockTitle }}</h2>
      </div>
      <div class="app__stat">
        <span class="app__stat-label">{{ t.clockTimeLabel }}</span>
        <span class="app__stat-value">{{ formattedTime }}</span>
      </div>
      <div class="app__stat">
        <span class="app__stat-label">{{ t.clockDateLabel }}</span>
        <span class="app__stat-value">{{ formattedDate }}</span>
      </div>
      <label class="app__field">
        <span class="app__field-label">{{ t.clockTimezoneLabel }}</span>
        <select class="app__select" :value="timeZone" @change="handleTimeZoneChange">
          <option v-for="zone in timeZones" :key="zone.value" :value="zone.value">
            {{ zone.label }}
          </option>
        </select>
      </label>
    </aside>
    <aside class="app__widget app__widget--right">
      <div class="app__widget-header">
        <i class="fa-solid fa-cloud-sun" aria-hidden="true"></i>
        <h2 class="app__widget-title">{{ t.weatherTitle }}</h2>
      </div>
      <label class="app__field">
        <span class="app__field-label">{{ t.weatherLocationLabel }}</span>
        <select class="app__select" :value="weatherLocation" @change="handleWeatherLocationChange">
          <option v-for="location in weatherLocations" :key="location.value" :value="location.value">
            {{ location.label }}
          </option>
        </select>
      </label>
      <p v-if="weatherLoading" class="app__status">{{ t.weatherLoading }}</p>
      <p v-else-if="weatherError" class="app__status">{{ t.weatherError }}</p>
      <div v-else-if="weather" class="app__weather">
        <div class="app__stat">
          <span class="app__stat-label">{{ t.weatherTempLabel }}</span>
          <span class="app__stat-value">{{ weather.temperature }}°C</span>
        </div>
        <div class="app__stat">
          <span class="app__stat-label">{{ t.weatherWindLabel }}</span>
          <span class="app__stat-value">{{ weather.wind }} km/h</span>
        </div>
      </div>
    </aside>
    <header class="app__header">
      <RouterLink class="app__brand" to="/home">
        <p class="app__eyebrow">{{ t.headerEyebrow }}</p>
        <h1 v-if="t.headerTitle" class="app__title">{{ t.headerTitle }}</h1>
      </RouterLink>
      <button
        class="app__nav-toggle"
        type="button"
        :aria-expanded="isNavOpen"
        aria-controls="primary-navigation"
        aria-label="Toggle navigation"
        @click="toggleNav"
      >
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
        <span class="app__nav-toggle-text">Menu</span>
      </button>
      <nav
        id="primary-navigation"
        class="app__nav"
        :class="{ 'app__nav--open': isNavOpen }"
      >
        <a class="app__nav-link" href="#home" @click="isNavOpen = false">
          {{ t.navHome }}
        </a>
        <a class="app__nav-link" href="#posts" @click="isNavOpen = false">
          {{ t.navPosts }}
        </a>
        <a class="app__nav-link" href="#projects" @click="isNavOpen = false">
          {{ t.navProjects }}
        </a>
        <a class="app__nav-link" href="#contact" @click="isNavOpen = false">
          {{ t.navContact }}
        </a>
      </nav>
      <div class="app__header-actions">
        <SettingsMenu
          :label="t.settingsLabel"
          :theme-label="t.themeLabel"
          :theme-select-label="t.themeSelectLabel"
          :language-label="t.languageLabel"
          :current-theme="theme"
          :theme-options="[
            { value: 'light', label: t.lightLabel, icon: 'sun' },
            { value: 'dark', label: t.darkLabel, icon: 'moon' },
            { value: 'christmas', label: t.christmasLabel, icon: 'tree' },
            { value: 'lunar', label: t.lunarLabel, icon: 'sparkles' },
            { value: 'halloween', label: t.halloweenLabel, icon: 'pumpkin' },
          ]"
          :current-locale="locale"
          @change-theme="setTheme"
          @change-locale="changeLocale"
        />
      </div>
    </header>
    <MainLayout
      :cat-image-url="catImageUrl"
      :cat-title="t.catTitle"
      :cat-button="t.catButton"
      :cat-loading="catLoading"
      :cat-loading-text="t.catLoading"
      :daily-quote-title="t.dailyQuoteTitle"
      :daily-quote-loading="t.dailyQuoteLoading"
      :daily-quote-error="t.dailyQuoteError"
      :quote="quote"
      :quote-loading="quoteLoading"
      :quote-error="quoteError"
      :music-title="t.musicTitle"
      :music-text="t.musicText"
      :player-prev="t.playerPrev"
      :player-next="t.playerNext"
      :playlist-label="t.playlistLabel"
      :playlist="playlist"
      :current-video-index="currentVideoIndex"
      @next-video="goNextVideo"
      @prev-video="goPrevVideo"
      @select-video="selectVideo"
      @refresh-cat="loadCatImage"
    />
    <MusicPlayer :tracks="mp3Tracks" />
  </main>
</template>
