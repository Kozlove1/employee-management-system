import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess({script: true}),
  
  compilerOptions: {
    runes: true
  },
  
  kit: {
    adapter: adapter(),
    alias: {
      '$lib': 'src/lib'
    }
  },
  
  onwarn: (warning, handler) => {
    // Игнорируем предупреждения от node_modules
    if (warning.filename && warning.filename.includes('node_modules')) {
      return;
    }
    handler(warning);
  }
}

export default config
