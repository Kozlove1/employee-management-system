import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['lucide-svelte']
  },
  ssr: {
    noExternal: process.env.NODE_ENV === 'production' ? [] : ['*']
  }
})
