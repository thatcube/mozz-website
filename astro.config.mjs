// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://mozzmusic.com',
  integrations: [sitemap()],
  // The dev toolbar overlays the page and lands in every review screenshot.
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
