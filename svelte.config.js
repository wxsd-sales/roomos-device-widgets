import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
export const pkg = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      scss: { prependData: '@use "src/variables.scss" as *;' }
    })
  ],

  kit: {
    adapter: adapter(),

    vite: {
      css: { preprocessorOptions: { scss: { additionalData: '@use "src/variables.scss" as *;' } } },
      envPrefix: 'EXPOSED',
      optimizeDeps: { include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep'] }
    }
  }
};

export default config;
