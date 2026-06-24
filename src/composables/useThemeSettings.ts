import { computed, ref } from 'vue'

export type AppTheme = 'light' | 'dark'

const THEME_KEY = 'ystasearea-theme'

const isTheme = (value: string): value is AppTheme => value === 'light' || value === 'dark'

const getSystemTheme = (): AppTheme =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'

export const useThemeSettings = () => {
  const theme = ref<AppTheme>('dark')

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  const setTheme = (nextTheme: AppTheme) => {
    theme.value = nextTheme
    applyTheme()
    localStorage.setItem(THEME_KEY, nextTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const hydrateTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    theme.value = savedTheme && isTheme(savedTheme) ? savedTheme : getSystemTheme()
    applyTheme()
  }

  const isDarkTheme = computed(() => theme.value === 'dark')

  return {
    theme,
    isDarkTheme,
    setTheme,
    toggleTheme,
    hydrateTheme,
  }
}
