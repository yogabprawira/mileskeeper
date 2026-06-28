import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server proxies API calls to the Go backend; build emits to web/dist.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
