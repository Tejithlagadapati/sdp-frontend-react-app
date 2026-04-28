import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/userapi': {
        target: 'http://localhost:2026',
        changeOrigin: true,
        secure: false,
      },
      '/adminapi': {
        target: 'http://localhost:2026',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
