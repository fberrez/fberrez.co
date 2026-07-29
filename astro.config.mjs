import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The archive marks itself `noindex` while it has no published post, and a
// sitemap that lists a `noindex` URL asks Google to crawl a page that then
// tells it to go away — Search Console reports that as an error. Both sides
// read the same condition: at least one non-draft .md in the collection.
const WRITING_DIR = fileURLToPath(new URL('./src/content/writing', import.meta.url));

function hasPublishedPost() {
  let names;
  try {
    names = readdirSync(WRITING_DIR, { recursive: true });
  } catch {
    return false; // No collection directory yet, so nothing to link to.
  }
  return names
    .map(String)
    .filter((name) => name.endsWith('.md'))
    .some((name) => !/^draft:\s*true\s*$/m.test(readFileSync(`${WRITING_DIR}/${name}`, 'utf8')));
}

const writingIsLinkable = hasPublishedPost();

export default defineConfig({
  site: 'https://www.fberrez.co',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => writingIsLinkable || new URL(page).pathname !== '/writing',
    }),
  ],
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
