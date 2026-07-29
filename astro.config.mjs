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

/** A `date:`/`updated:` value, as the YYYY-MM-DD the schema coerces from. */
function dateField(block, name) {
  const match = block.match(new RegExp(`^${name}:\\s*(\\d{4}-\\d{2}-\\d{2})`, 'm'));
  return match ? match[1] : null;
}

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
        // `updated` wins when present: lastmod answers "has this changed since
        // you last crawled it", which is not the same question as "when was it
        // published".
        lastmod: dateField(block, 'updated') ?? dateField(block, 'date'),
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

// `lastmod` is the difference between handing a crawler a list of URLs and
// telling it which ones are worth looking at again. Without it Google decides
// on its own when to recrawl, which is why a new post otherwise needs a manual
// nudge in Search Console.
const listed = shipped.filter((post) => !post.unlisted);
const lastmodByPath = new Map(
  listed.filter((post) => post.lastmod).map((post) => [post.path, post.lastmod]),
);

// The home page carries the three most recent posts and the archive lists all
// of them, so both genuinely change whenever one is published. Dating them off
// the newest post is honest; leaving them undated would understate it.
const newest = listed
  .map((post) => post.lastmod)
  .filter(Boolean)
  .sort()
  .at(-1);
if (newest) {
  lastmodByPath.set('/', newest);
  lastmodByPath.set('/writing', newest);
}

export default defineConfig({
  site: 'https://www.fberrez.co',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !noindexPaths.has(new URL(page).pathname),
      serialize(item) {
        // Astro emits the home page without a trailing slash here, so '' is '/'.
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const lastmod = lastmodByPath.get(path);
        return lastmod ? { ...item, lastmod: new Date(`${lastmod}T00:00:00Z`).toISOString() } : item;
      },
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
