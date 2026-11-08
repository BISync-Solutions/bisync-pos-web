import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://pos.bisync.dev',
  base: '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
