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

// Same two typefaces and the same cobalt as the site. Satori cannot do
// backdrop-filter or oklch, so the card states the design rather than imitating
// it: lit paper, a labelled gutter, and the product table as the subject.
const PAPER = '#fbfbfc';
const PAPER_EDGE = '#eceef1';
const INK = '#0e1116';
const MID = '#5b626d';
const GHOST = '#a8aeb8';
const RULE = '#dfe2e7';
const ACC = '#1d4ed8';

const PRODUCTS = [
  ['01', 'mambo', 'Database client'],
  ['02', 'foyer', 'Ambient sound'],
  ['03', 'quietdash', 'E-ink dashboard'],
  ['04', 'blurt.sh', 'Markdown publishing'],
];

const row = ([no, name, what], i) => `
  <div style="
    display: flex;
    align-items: center;
    padding: 13px 0;
    ${i === 0 ? '' : `border-top: 1px solid ${RULE};`}
  ">
    <span style="display: flex; width: 46px; font-size: 17px; color: ${GHOST};">${no}</span>
    <span style="display: flex; width: 210px; font-size: 22px; font-weight: 500; color: ${INK};">${name}</span>
    <span style="display: flex; font-family: serif; font-style: italic; font-size: 21px; color: ${MID};">${what}</span>
  </div>`;

// Called as a function on an already-built string, not as a tagged template:
// used as a tag, satori-html escapes interpolated values, so the product rows
// came out rendered as visible HTML source.
const ogMarkup = html(`
  <div style="
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px 76px;
    background: linear-gradient(158deg, ${PAPER} 0%, ${PAPER_EDGE} 100%);
    color: ${INK};
    font-family: mono;
  ">
    <div style="display: flex; align-items: flex-start;">
      <span style="
        display: flex;
        width: 168px;
        font-size: 15px;
        letter-spacing: 3px;
        color: ${GHOST};
        padding-top: 14px;
      ">PROFILE</span>
      <div style="display: flex; flex-direction: column;">
        <span style="
          display: flex;
          font-family: serif;
          font-size: 58px;
          line-height: 1.16;
          letter-spacing: -1.4px;
          color: ${INK};
        ">I make small software</span>
        <span style="
          display: flex;
          font-family: serif;
          font-size: 58px;
          line-height: 1.16;
          letter-spacing: -1.4px;
          color: ${INK};
        ">and I actually finish it.</span>
      </div>
    </div>

    <div style="display: flex; align-items: flex-start;">
      <span style="
        display: flex;
        width: 168px;
        font-size: 15px;
        letter-spacing: 3px;
        color: ${GHOST};
        padding-top: 14px;
      ">PRODUCTS</span>
      <div style="display: flex; flex-direction: column; width: 880px;">
        ${PRODUCTS.map(row).join('')}
      </div>
    </div>

    <div style="display: flex; align-items: center;">
      <span style="display: flex; width: 168px;"></span>
      <span style="display: flex; width: 10px; height: 10px; background: ${ACC};"></span>
      <span style="
        display: flex;
        margin-left: 14px;
        font-size: 19px;
        letter-spacing: 2px;
        color: ${MID};
      ">FBERREZ.CO</span>
      <span style="
        display: flex;
        margin-left: 26px;
        font-size: 19px;
        letter-spacing: 2px;
        color: ${GHOST};
      ">PARIS, FR</span>
    </div>
  </div>
`);

// The mark is the filled cobalt square the site uses for "shipping", set beside
// the initial — the one glyph that carries meaning on every page of the site.
const faviconMarkup = html`
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
`;

async function loadGoogleFont(family) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

async function renderPng(markup, { width, height, fonts }) {
  const svg = await satori(markup, { width, height, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

async function main() {
  const [mono, monoMedium, serif, serifItalic] = await Promise.all([
    loadGoogleFont('IBM+Plex+Mono:wght@400'),
    loadGoogleFont('IBM+Plex+Mono:wght@500'),
    loadGoogleFont('Source+Serif+4:wght@400'),
    loadGoogleFont('Source+Serif+4:ital,wght@1,400'),
  ]);

  const fonts = [
    { name: 'mono', data: mono, weight: 400, style: 'normal' },
    { name: 'mono', data: monoMedium, weight: 500, style: 'normal' },
    { name: 'serif', data: serif, weight: 400, style: 'normal' },
    { name: 'serif', data: serifItalic, weight: 400, style: 'italic' },
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
