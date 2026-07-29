import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeTableScroll } from './src/lib/rehype-table-scroll.mjs';

// The archive marks itself `noindex` while it has no listed post, and a sitemap
// that lists a `noindex` URL asks Google to crawl a page that then tells it to
// go away — Search Console reports that as an error. The same goes for a post
// marked `unlisted`, which ships with a working URL that nothing points at.
//
// The content collection is the source of truth for both, but the sitemap
// integration is configured before Astro can read it, so this re-reads the
// frontmatter off disk. It stays in sync with src/content.config.ts by reading
// the same two flags.
const WRITING_DIR = fileURLToPath(new URL('./src/content/writing', import.meta.url));

/** The `---` block only. Scanning the whole file would match a fenced example. */
function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

const flag = (block, name) => new RegExp(`^${name}:\\s*true\\s*$`, 'm').test(block);

function readWriting() {
  let names;
  try {
    names = readdirSync(WRITING_DIR, { recursive: true });
  } catch {
    return []; // No collection directory yet, so nothing to link to.
  }
  return names
    .map(String)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const block = frontmatter(readFileSync(`${WRITING_DIR}/${name}`, 'utf8'));
      // The glob loader derives the id from the path minus the extension, so
      // this is the same slug the route builds.
      return {
        path: `/writing/${name.replace(/\.md$/, '')}`,
        draft: flag(block, 'draft'),
        unlisted: flag(block, 'unlisted'),
      };
    });
}

const writing = readWriting();
const shipped = writing.filter((post) => !post.draft);
const writingIsLinkable = shipped.some((post) => !post.unlisted);
const noindexPaths = new Set([
  ...shipped.filter((post) => post.unlisted).map((post) => post.path),
  ...(writingIsLinkable ? [] : ['/writing']),
]);

export default defineConfig({
  site: 'https://www.fberrez.co',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !noindexPaths.has(new URL(page).pathname),
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
    // A table wider than the phone would otherwise scroll the whole article.
    rehypePlugins: [rehypeTableScroll],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { fs: { strict: false } },
  },
});
