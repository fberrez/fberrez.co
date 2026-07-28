import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.fberrez.co',
  trailingSlash: 'never',
  integrations: [sitemap()],
  markdown: {
    // Shiki ships a dark theme by default, and its inline colours land on the
    // light glass surface of `.prose pre` at roughly no contrast. Beyond that,
    // multi-colour highlighting would be the loudest thing on a page built on
    // ink, paper and a single cobalt accent.
    //
    // Code is set monochrome instead. To bring highlighting back, replace this
    // with `shikiConfig: { themes: { light: '…', dark: '…' } }` and drop the
    // colour rules on `.prose pre` in global.css.
    syntaxHighlight: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { fs: { strict: false } },
  },
});
