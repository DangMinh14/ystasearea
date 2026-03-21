import { computed, ref } from 'vue'
import { translations, type Locale } from '../content/translations'

const LOCALE_KEY = 'ystasearea-locale'

export const useLocaleSettings = () => {
  const locale = ref<Locale>('vi')

  const hydrateLocale = () => {
    const savedLocale = localStorage.getItem(LOCALE_KEY)
    if (savedLocale === 'vi' || savedLocale === 'en') {
      locale.value = savedLocale
    }
  }

  const changeLocale = (nextLocale: Locale) => {
    locale.value = nextLocale
    localStorage.setItem(LOCALE_KEY, nextLocale)
  }

  const t = computed(() => translations[locale.value])

  return {
    locale,
    t,
    hydrateLocale,
    changeLocale,
  }
}
