import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: 'localhost',
		port: 5173,
		proxy: {
			'/api': {
				target: 'https://ammocoin.netinvitation.ru',
				// target: 'https://ammocoin.sequoialab.ru',

				changeOrigin: true,
				secure: false
			}
		}
	},
	optimizeDeps: {
		include: ['@lucide/svelte']
	}
})
