import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/**
 * Every post that gets a URL, newest first. Drafts ship only in dev.
 *
 * This is what the routes build from — the article page and its social card —
 * so an unlisted post is reachable. Use `getPosts()` for anything that *shows*
 * a list to a reader.
 */
export async function getRoutablePosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Posts that are allowed to appear in a listing, newest first.
 *
 * Everything that advertises the writing reads this one — the archive, the home
 * page, the feed, and the nav's decision to show a Writing tab at all — so a
 * post marked `unlisted` drops out of all of them from this single line.
 */
export async function getPosts(): Promise<Post[]> {
  return (await getRoutablePosts()).filter((post) => !post.data.unlisted);
}

/** Reading time in whole minutes, floored at 1. 200 wpm is the usual estimate. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** 2026-01-22 — sortable, unambiguous, and it lines up in a column. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 01-22, for the archive where the year already sits in the gutter. */
export function monthDay(date: Date): string {
  return isoDate(date).slice(5);
}

/** Group posts by year, newest year first, preserving the newest-first order. */
export function byYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
}
