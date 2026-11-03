import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // The shadcn convention. Components dropped into src/components/ui expect
    // to import '@/lib/utils', so the alias has to exist before they will
    // resolve at all.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
