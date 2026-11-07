import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://erick83.github.io',
  base: '/bisync-pos-web',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
