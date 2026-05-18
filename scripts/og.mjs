import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/og-image.png');

async function loadGoogleFont(family) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

const markup = html`
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
        I build small, focused products.
      </div>
    </div>

    <div style="
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #7a5d4a;
      letter-spacing: 0.04em;
    ">
      <span style="display: flex;">Paris, France · software engineer</span>
    </div>
  </div>
`;

const dynImport = (m) => import(m);
async function main() {
  // satori-html exports either as default or named — handle both.
  const [serifItalic, mono] = await Promise.all([
    loadGoogleFont('Newsreader:ital@1'),
    loadGoogleFont('JetBrains+Mono:wght@400'),
  ]);

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'serif', data: serifItalic, weight: 400, style: 'italic' },
      { name: 'mono', data: mono, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    .render()
    .asPng();

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, png);
  console.log(`✓ wrote ${OUT} (${(png.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('og build failed:', err);
  process.exit(1);
});
