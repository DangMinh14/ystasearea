import type { ComputedRef, Ref } from 'vue'
import type { Locale, TranslationKeys } from '../content/translations'
import type { AppTheme } from './useThemeSettings'
import type { QuoteResponse } from '../services/quoteService'

export type AppShellContext = {
  locale: Ref<Locale>
  t: ComputedRef<TranslationKeys>
  theme: Ref<AppTheme>
  setTheme: (theme: AppTheme) => void
  changeLocale: (locale: Locale) => void
  quote: Ref<QuoteResponse | null>
  quoteLoading: Ref<boolean>
  quoteError: Ref<string>
  catImageUrl: Ref<string>
  catLoading: Ref<boolean>
  dogImageUrl: Ref<string>
  dogLoading: Ref<boolean>
  refreshCat: () => Promise<void>
  refreshDog: () => Promise<void>
}

export const appShellContextKey = Symbol('app-shell-context')
