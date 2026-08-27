// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://mozzmusic.com',
  integrations: [
    // Only the launched homepage belongs in the sitemap. Every other route is
    // the review material behind it and carries a noindex tag, so listing them
    // would be asking a crawler to fetch a hundred pages we then tell it to
    // ignore.
    sitemap({ filter: (page) => page === 'https://mozzmusic.com/' }),
  ],
  // The dev toolbar overlays the page and lands in every review screenshot.
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
