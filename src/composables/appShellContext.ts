import type { ComputedRef, Ref } from 'vue'
import type { Locale, TranslationKeys } from '../content/translations'
import type { AppTheme } from './useThemeSettings'
import type { WeatherSnapshot, WeatherLocation } from '../services/weatherService'
import type { QuoteResponse } from '../services/quoteService'
import type { PlaylistVideo, Mp3Track } from './usePlaylist'

export type AppShellContext = {
  locale: Ref<Locale>
  t: ComputedRef<TranslationKeys>
  theme: Ref<AppTheme>
  setTheme: (theme: AppTheme) => void
  changeLocale: (locale: Locale) => void
  quote: Ref<QuoteResponse | null>
  quoteLoading: Ref<boolean>
  quoteError: Ref<string>
  weather: Ref<WeatherSnapshot | null>
  weatherLoading: Ref<boolean>
  weatherError: Ref<string>
  weatherLocation: Ref<string>
  weatherLocations: WeatherLocation[]
  catImageUrl: Ref<string>
  catLoading: Ref<boolean>
  dogImageUrl: Ref<string>
  dogLoading: Ref<boolean>
  refreshCat: () => Promise<void>
  refreshDog: () => Promise<void>
  playlist: PlaylistVideo[]
  currentVideoIndex: Ref<number>
  currentVideo: ComputedRef<PlaylistVideo>
  onNextVideo: () => void
  onPrevVideo: () => void
  onSelectVideo: (index: number) => void
  mp3Tracks: Mp3Track[]
}

export const appShellContextKey = Symbol('app-shell-context')
