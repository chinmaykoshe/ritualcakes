import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/auth': {
        target: 'https://ritualcakes-stg-92alpha.vercel.app',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://ritualcakes-stg-92alpha.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
