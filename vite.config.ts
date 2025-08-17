import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      runes: true
    }
  })],
  resolve: {
    alias: {
      '$lib': fileURLToPath(new URL('./src/lib', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['lucide-svelte']
  }
})
