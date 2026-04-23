import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '.worktrees/**'],
  },
  server: {
    proxy: {
      '/api/quote': {
        target: 'https://zenquotes.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quote$/, '/api/random'),
      },
    },
  },
})
