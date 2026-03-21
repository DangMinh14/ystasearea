import { computed, ref } from 'vue'

export type AppTheme = 'light' | 'dark' | 'christmas' | 'lunar' | 'halloween'

const THEME_KEY = 'ystasearea-theme'

const isTheme = (value: string): value is AppTheme =>
  value === 'light' || value === 'dark' || value === 'christmas' || value === 'lunar' || value === 'halloween'

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

  const hydrateTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme && isTheme(savedTheme)) {
      theme.value = savedTheme
    }
    applyTheme()
  }

  const isLunarTheme = computed(() => theme.value === 'lunar')
  const isHalloweenTheme = computed(() => theme.value === 'halloween')

  return {
    theme,
    isLunarTheme,
    isHalloweenTheme,
    setTheme,
    hydrateTheme,
  }
}
