import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

/* Favicon only.

   Social cards used to live here too, as a single static og-image.png. They
   are now generated one per page by src/pages/og/[...slug].png.ts, which can
   see the content collection and so covers every future post on its own.

   The favicon stays a build script because it is a public asset referenced by
   <link rel="icon">, not a route. */

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FAVICON_OUT = resolve(ROOT, 'public/favicon.png');

const PAPER = '#fbfbfc';
const PAPER_EDGE = '#eceef1';
const INK = '#0e1116';
const ACC = '#1d4ed8';

// The mark is the filled cobalt square the site uses for "shipping", set beside
// the initial — the one glyph that carries meaning on every page.
const faviconMarkup = html(`
  <div style="
    width: 256px;
    height: 256px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(158deg, ${PAPER} 0%, ${PAPER_EDGE} 100%);
  ">
    <div style="display: flex; align-items: flex-end;">
      <span style="
        display: flex;
        font-family: mono;
        font-weight: 500;
        font-size: 170px;
        line-height: 1;
        color: ${INK};
      ">f</span>
      <span style="
        display: flex;
        width: 30px;
        height: 30px;
        background: ${ACC};
        margin-left: 10px;
        margin-bottom: 26px;
      "></span>
    </div>
  </div>
`);

async function loadGoogleFont(family) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

async function main() {
  const mono = await loadGoogleFont('IBM+Plex+Mono:wght@500');
  const fonts = [{ name: 'mono', data: mono, weight: 500, style: 'normal' }];

  const svg = await satori(faviconMarkup, { width: 256, height: 256, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 256 } }).render().asPng();

  await mkdir(dirname(FAVICON_OUT), { recursive: true });
  await writeFile(FAVICON_OUT, png);
  console.log(`✓ wrote ${FAVICON_OUT} (${(png.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('favicon build failed:', err);
  process.exit(1);
});
