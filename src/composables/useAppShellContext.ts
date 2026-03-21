import { inject } from 'vue'
import { appShellContextKey, type AppShellContext } from './appShellContext'

export const useAppShellContext = () => {
  const shell = inject<AppShellContext>(appShellContextKey)
  if (!shell) {
    throw new Error('App shell context is required for this component.')
  }

  return shell
}
