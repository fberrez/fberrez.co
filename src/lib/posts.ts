import { getCollection } from 'astro:content';

// Drafts show in `pnpm dev`, never in the production build.
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(d)
    .toLowerCase();
