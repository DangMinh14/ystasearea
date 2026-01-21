import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
