import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OG_OUT = resolve(ROOT, 'public/og-image.png');
const FAVICON_OUT = resolve(ROOT, 'public/favicon.png');

// The footer dots are the five worlds the scroll moves through, in their
// hero-tuned accents: mambo teal, foyer graphite, quietdash brick,
// minihabits cobalt, blurt red. Same marks as the "Ahead" line on the page.

async function loadGoogleFont(family) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

const ogMarkup = html`
  <div style="
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 88px;
    background: #ede5d6;
    color: #1d150f;
    font-family: mono;
  ">
    <div style="display: flex; flex-direction: column; gap: 28px;">
      <div style="
        display: flex;
        align-items: flex-end;
        font-family: serif;
        font-style: italic;
        font-size: 200px;
        line-height: 1;
        letter-spacing: -0.02em;
        color: #1d150f;
      ">
        <span style="display: flex;">fberrez.co</span>
        <span style="
          display: flex;
          width: 28px;
          height: 28px;
          background: #b54a2e;
          border-radius: 999px;
          margin-left: 20px;
          margin-bottom: 28px;
        "></span>
      </div>
      <div style="
        display: flex;
        font-family: serif;
        font-style: italic;
        font-size: 56px;
        line-height: 1.2;
        color: #5a4434;
      ">
        A lot of small, focused things.
      </div>
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span style="display: flex; font-size: 24px; color: #7a5d4a; letter-spacing: 0.04em;">
        Paris, France · software engineer
      </span>
      <div style="display: flex; align-items: center;">
        <span style="display: flex; width: 26px; height: 26px; border-radius: 999px; background: #1c8b86; margin-left: 16px;"></span>
        <span style="display: flex; width: 26px; height: 26px; border-radius: 999px; background: #3a4049; margin-left: 16px;"></span>
        <span style="display: flex; width: 26px; height: 26px; border-radius: 999px; background: #b54a2e; margin-left: 16px;"></span>
        <span style="display: flex; width: 26px; height: 26px; border-radius: 999px; background: #3358c9; margin-left: 16px;"></span>
        <span style="display: flex; width: 26px; height: 26px; border-radius: 999px; background: #c41f33; margin-left: 16px;"></span>
      </div>
    </div>
  </div>
`;

const faviconMarkup = html`
  <div style="
    width: 256px;
    height: 256px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ede5d6;
  ">
    <div style="display: flex; align-items: flex-end;">
      <span style="
        display: flex;
        font-family: serif;
        font-style: italic;
        font-weight: 600;
        font-size: 196px;
        line-height: 1;
        color: #1d150f;
      ">f</span>
      <span style="
        display: flex;
        width: 26px;
        height: 26px;
        border-radius: 999px;
        background: #b54a2e;
        margin-left: 8px;
        margin-bottom: 34px;
      "></span>
    </div>
  </div>
`;

async function renderPng(markup, { width, height, fonts }) {
  const svg = await satori(markup, { width, height, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

async function main() {
  const [serifItalic, serifItalicBold, mono] = await Promise.all([
    loadGoogleFont('Newsreader:ital@1'),
    loadGoogleFont('Newsreader:ital,wght@1,600'),
    loadGoogleFont('JetBrains+Mono:wght@400'),
  ]);

  const fonts = [
    { name: 'serif', data: serifItalic, weight: 400, style: 'italic' },
    { name: 'serif', data: serifItalicBold, weight: 600, style: 'italic' },
    { name: 'mono', data: mono, weight: 400, style: 'normal' },
  ];

  await mkdir(dirname(OG_OUT), { recursive: true });

  const og = await renderPng(ogMarkup, { width: 1200, height: 630, fonts });
  await writeFile(OG_OUT, og);
  console.log(`✓ wrote ${OG_OUT} (${(og.length / 1024).toFixed(1)} KB)`);

  const favicon = await renderPng(faviconMarkup, { width: 256, height: 256, fonts });
  await writeFile(FAVICON_OUT, favicon);
  console.log(`✓ wrote ${FAVICON_OUT} (${(favicon.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('og build failed:', err);
  process.exit(1);
});
