import type { ComputedRef, Ref } from 'vue'

export type PageShellContext = {
  catImageUrl: Ref<string>
  catTitle: ComputedRef<string>
  catButton: ComputedRef<string>
  catLoading: Ref<boolean>
  catLoadingText: ComputedRef<string>
  dogImageUrl: Ref<string>
  dogTitle: ComputedRef<string>
  dogButton: ComputedRef<string>
  dogLoading: Ref<boolean>
  dogLoadingText: ComputedRef<string>
  dailyQuoteTitle: ComputedRef<string>
  dailyQuoteLoading: ComputedRef<string>
  dailyQuoteError: ComputedRef<string>
  quote: Ref<{ content: string; author: string } | null>
  quoteLoading: Ref<boolean>
  quoteError: Ref<string>
  musicTitle: ComputedRef<string>
  musicText: ComputedRef<string>
  playerPrev: ComputedRef<string>
  playerNext: ComputedRef<string>
  playlistLabel: ComputedRef<string>
  playlist: { id: string; title: string }[]
  currentVideoIndex: Ref<number>
  onNextVideo: () => void
  onPrevVideo: () => void
  onSelectVideo: (index: number) => void
  onRefreshCat: () => void
  onRefreshDog: () => void
}

export const pageShellContextKey = Symbol('page-shell-context')
