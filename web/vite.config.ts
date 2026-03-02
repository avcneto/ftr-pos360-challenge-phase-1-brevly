import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Use backend service name in Docker, fallback to localhost for local dev
const apiTarget = process.env.VITE_API_URL ?? 'http://backend:3333'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/links': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
