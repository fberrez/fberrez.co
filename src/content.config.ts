import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts are plain markdown files in src/content/writing. Drop one in, it shows
// up — there is no database that owns the writing, which is rather the point.
const writing = defineCollection({
  // Plain .md only: the brace form matched twice and made the loader warn about
  // duplicate ids, and mdx would need an integration that is not installed.
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    /** One line, used as the lede, the meta description and the RSS summary. */
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Shown on the article's spec plate, e.g. "Tools, files". */
    topic: z.string().optional(),
    /** Which product the post is about, if any, e.g. "blurt.sh". */
    product: z.string().optional(),
    /** Draft posts build locally but never ship. */
    draft: z.boolean().default(false),
    /**
     * Unlisted posts ship and keep a working URL, but nothing points at it: no
     * archive row, no home page row, no RSS item, no sitemap entry, and the
     * page itself carries `noindex`. For handing a link to someone before the
     * piece is meant to be found. A draft has no URL at all; this has one.
     */
    unlisted: z.boolean().default(false),
  }),
});

export const collections = { writing };
