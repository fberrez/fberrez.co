import type { APIRoute } from 'astro';
import { PROJECTS } from '../../components/projects.js';
import { getRoutablePosts, isoDate, readingTime } from '../../lib/posts';
import { renderCard, type Card } from '../../lib/og';

/* One card per page. The slug mirrors the page's own path — `/` becomes
   `index`, `/writing/foo` becomes `writing/foo` — so Base.astro can derive the
   image URL from the pathname and every future post gets a card for free. */

export async function getStaticPaths() {
  // Routable, not listed: an unlisted post is still shared by hand, and a link
  // with no card is exactly what it should not look like.
  const posts = await getRoutablePosts();

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
    {
      params: { slug: 'writing' },
      props: {
        card: {
          label: 'WRITING',
          title: 'Notes on shipping small software.',
          sub: 'What broke, what I would not build again, and why the thing ended up smaller than planned.',
          footerRight: 'PARIS, FR',
        },
      },
    },
  ];

  for (const post of posts) {
    pages.push({
      params: { slug: `writing/${post.id}` },
      props: {
        card: {
          label: (post.data.topic ?? 'WRITING').toUpperCase(),
          title: post.data.title,
          sub: post.data.description,
          footerRight: `${isoDate(post.data.date)} · ${readingTime(post.body)} MIN`,
        },
      },
    });
  }

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
