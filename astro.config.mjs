import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.fberrez.co',
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { fs: { strict: false } },
  },
});
