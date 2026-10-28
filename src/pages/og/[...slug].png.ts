import type { APIRoute } from 'astro';
import { PROJECTS } from '../../components/projects.js';
import { renderCard, type Card } from '../../lib/og';

/* One card per page. The slug mirrors the page's path, so `/` becomes `index`
   and Base.astro can derive the image URL without per-page wiring. */

export async function getStaticPaths() {
  const pages: { params: { slug: string }; props: { card: Card } }[] = [
    {
      params: { slug: 'index' },
      props: {
        card: {
          label: 'PROFILE',
          title: 'I make software that stays small on purpose.',
          rows: PROJECTS.filter((p) => p.state !== 'archived').map(
            (p) => [p.name, p.desc] as [string, string],
          ),
          footerRight: 'PARIS, FR',
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
