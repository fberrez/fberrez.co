import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/** Published posts, newest first. Drafts ship only in dev. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
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
