import { ImageResponse } from 'next/og';
import { html } from 'satori-html';

export const alt = 'Florent Berrez — ships small things';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadGoogleFont(family) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font ${family}`);
  return (await fetch(match[1])).arrayBuffer();
}

export default async function Image() {
  let serifItalic, mono;
  try {
    [serifItalic, mono] = await Promise.all([
      loadGoogleFont('Newsreader:ital@1'),
      loadGoogleFont('JetBrains+Mono:wght@400'),
    ]);
  } catch {
    serifItalic = null;
    mono = null;
  }

  const markup = html`
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px 88px;
      background: #ede5d6;
      color: #1d150f;
      font-family: mono;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #7a5d4a;
        font-size: 22px;
        letter-spacing: 0.04em;
      ">
        <span>~/fberrez</span>
        <span>fberrez.co</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px; margin-top: -40px;">
        <div style="
          display: flex;
          align-items: flex-end;
          font-family: serif;
          font-style: italic;
          font-size: 176px;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #1d150f;
        ">
          <span style="display: flex;">Florent Berrez</span>
          <span style="
            display: flex;
            width: 24px;
            height: 24px;
            background: #b54a2e;
            border-radius: 999px;
            margin-left: 18px;
            margin-bottom: 24px;
          "></span>
        </div>
        <div style="
          display: flex;
          font-family: serif;
          font-style: italic;
          font-size: 52px;
          line-height: 1.2;
          color: #5a4434;
        ">
          I build small, focused products.
        </div>
      </div>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        color: #7a5d4a;
        letter-spacing: 0.04em;
      ">
        <span style="display: flex;">Paris, France · software engineer</span>
        <span style="
          display: flex;
          background: #1d150f;
          color: #ede5d6;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 18px;
          letter-spacing: 0.16em;
        ">FB</span>
      </div>
    </div>
  `;

  return new ImageResponse(markup, {
    ...size,
    fonts:
      serifItalic && mono
        ? [
            { name: 'serif', data: serifItalic, style: 'italic', weight: 400 },
            { name: 'mono', data: mono, style: 'normal', weight: 400 },
          ]
        : undefined,
  });
}
