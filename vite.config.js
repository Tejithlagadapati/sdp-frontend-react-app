import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/userapi': {
        target: 'https://fsad-sdp-backend-citizen-x2ui.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/adminapi': {
        target: 'https://fsad-sdp-backend-citizen-x2ui.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
