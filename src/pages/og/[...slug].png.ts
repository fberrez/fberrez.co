import type { APIRoute } from 'astro';
import { INTRO_LINE, WORDMARK } from '../../components/identity.js';
import { renderCard, type Card } from '../../lib/og';

/* One card per page. The slug mirrors the page's path, so `/` becomes `index`
   and Base.astro can derive the image URL without per-page wiring. */

export async function getStaticPaths() {
  const pages: { params: { slug: string }; props: { card: Card } }[] = [
    {
      params: { slug: 'index' },
      props: {
        card: {
          wordmark: WORDMARK,
          line: INTRO_LINE,
        },
      },
    },
  ];

  return pages;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard((props as { card: Card }).card);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
