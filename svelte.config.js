import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true
  },
  onwarn: (warning, handler) => {
    // Игнорируем предупреждения от node_modules
    if (warning.filename && warning.filename.includes('node_modules')) {
      return;
    }
    handler(warning);
  }
}
