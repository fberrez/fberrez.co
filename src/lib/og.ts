import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PAPER = '#101310';
const INK = '#e9eee9';

async function loadGoogleFont(family: string): Promise<Buffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

let fontsPromise: Promise<any[]> | null = null;

function getFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont('IBM+Plex+Mono:wght@400'),
      loadGoogleFont('IBM+Plex+Mono:wght@500'),
    ]).then(([mono, monoMedium]) => [
      { name: 'mono', data: mono, weight: 400, style: 'normal' },
      { name: 'mono', data: monoMedium, weight: 500, style: 'normal' },
    ]);
  }
  return fontsPromise;
}

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface Card {
  wordmark: string;
  line: string;
}

function markup(card: Card): string {
  return `
    <div style="
      width:${OG_WIDTH}px;
      height:${OG_HEIGHT}px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:72px;
      background:${PAPER};
      color:${INK};
      font-family:mono;
    ">
      <span style="
        display:flex;
        font-size:42px;
        font-weight:500;
        line-height:1;
        letter-spacing:0;
      ">${esc(card.wordmark)}</span>
      <span style="
        display:flex;
        margin-top:32px;
        font-size:28px;
        font-weight:400;
        line-height:1.35;
      ">${esc(card.line)}</span>
    </div>`;
}

export async function renderCard(card: Card): Promise<Buffer> {
  const fonts = await getFonts();
  const svg = await satori(html(markup(card)) as any, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });
  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng(),
  );
}
