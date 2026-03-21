import en from '../i18n/en.json'
import vi from '../i18n/vi.json'

export type Locale = 'vi' | 'en'

export type TranslationKeys = typeof en

export const translations: Record<Locale, TranslationKeys> = {
  en,
  vi,
}
