import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: 'Florent Berrez — writing',
    description:
      'Notes on shipping small software: what broke, what I would not build again, and why the thing ended up smaller than planned.',
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}`,
    })),
    customData: '<language>en</language>',
  });
}
