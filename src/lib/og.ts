import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

/* Social cards, one per page, rendered at build time.

   Satori cannot do backdrop-filter or oklch, so a card states the design
   rather than imitating it: lit paper, a labelled gutter, ink, one cobalt
   mark. Same two typefaces as the site. */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PAPER = '#fbfbfc';
const PAPER_EDGE = '#eceef1';
const INK = '#0e1116';
const MID = '#5b626d';
const GHOST = '#a8aeb8';
const RULE = '#dfe2e7';
const ACC = '#1d4ed8';

// Satori needs ttf/otf — it does not read woff2, which is what @fontsource
// ships. Google Fonts hands over truetype when asked without a modern UA.
async function loadGoogleFont(family: string): Promise<Buffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return Buffer.from(await (await fetch(match[1])).arrayBuffer());
}

// One fetch for the whole build, however many cards it renders.
let fontsPromise: Promise<any[]> | null = null;

function getFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont('IBM+Plex+Mono:wght@400'),
      loadGoogleFont('IBM+Plex+Mono:wght@500'),
      loadGoogleFont('Source+Serif+4:wght@400'),
      loadGoogleFont('Source+Serif+4:ital,wght@1,400'),
    ]).then(([mono, monoMedium, serif, serifItalic]) => [
      { name: 'mono', data: mono, weight: 400, style: 'normal' },
      { name: 'mono', data: monoMedium, weight: 500, style: 'normal' },
      { name: 'serif', data: serif, weight: 400, style: 'normal' },
      { name: 'serif', data: serifItalic, weight: 400, style: 'italic' },
    ]);
  }
  return fontsPromise;
}

/** Long titles have to come down in size or they run off the card. */
function titleSize(title: string): number {
  if (title.length > 78) return 40;
  if (title.length > 58) return 46;
  if (title.length > 40) return 52;
  return 58;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const gutter = (label: string) => `
  <span style="
    display: flex;
    width: 168px;
    font-size: 15px;
    letter-spacing: 3px;
    color: ${GHOST};
    padding-top: 14px;
  ">${esc(label)}</span>`;

const titleBlock = (title: string, sub?: string) => {
  const size = titleSize(title);
  return `
    <div style="display: flex; flex-direction: column; width: 900px;">
      <span style="
        display: flex;
        font-family: serif;
        font-size: ${size}px;
        line-height: 1.18;
        letter-spacing: -1.4px;
        color: ${INK};
      ">${esc(title)}</span>
      ${
        sub
          ? `<span style="
               display: flex;
               margin-top: 22px;
               font-family: serif;
               font-style: italic;
               font-size: 26px;
               line-height: 1.4;
               color: ${MID};
             ">${esc(sub)}</span>`
          : ''
      }
    </div>`;
};

const footer = (right: string) => `
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
    ${
      right
        ? `<span style="
             display: flex;
             margin-left: 26px;
             font-size: 19px;
             letter-spacing: 2px;
             color: ${GHOST};
           ">${esc(right)}</span>`
        : ''
    }
  </div>`;

const shell = (inner: string) => `
  <div style="
    width: ${OG_WIDTH}px;
    height: ${OG_HEIGHT}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px 76px;
    background: linear-gradient(158deg, ${PAPER} 0%, ${PAPER_EDGE} 100%);
    color: ${INK};
    font-family: mono;
  ">${inner}</div>`;

export interface Card {
  /** Left-gutter label, e.g. PROFILE or WRITING. */
  label: string;
  title: string;
  /** One line under the title. This is what makes a shared link readable. */
  sub?: string;
  /** Optional rows under the title: [left, right] pairs. */
  rows?: [string, string][];
  /** Right-hand footer text, e.g. PARIS, FR or a date. */
  footerRight?: string;
}

function markup(card: Card): string {
  const rows = (card.rows ?? [])
    .map(
      ([left, right], i) => `
        <div style="
          display: flex;
          align-items: center;
          padding: 13px 0;
          ${i === 0 ? '' : `border-top: 1px solid ${RULE};`}
        ">
          <span style="
            display: flex;
            width: 260px;
            font-size: 22px;
            font-weight: 500;
            color: ${INK};
          ">${esc(left)}</span>
          <span style="
            display: flex;
            font-family: serif;
            font-style: italic;
            font-size: 21px;
            color: ${MID};
          ">${esc(right)}</span>
        </div>`,
    )
    .join('');

  // Without a table under it, the title would sit alone at the top with a void
  // beneath — so it takes the free space and centres instead.
  const headAlign = rows ? 'align-items: flex-start;' : 'flex: 1; align-items: center;';

  return shell(`
    <div style="display: flex; ${headAlign}">
      ${gutter(card.label)}
      ${titleBlock(card.title, card.sub)}
    </div>
    ${
      rows
        ? `<div style="display: flex; align-items: flex-start;">
             ${gutter('')}
             <div style="display: flex; flex-direction: column; width: 880px;">${rows}</div>
           </div>`
        : ''
    }
    ${footer(card.footerRight ?? '')}
  `);
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
