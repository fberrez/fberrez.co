---
title: How this site is built
description: One light source, two typefaces, and a directory of markdown files.
date: 2026-07-28
topic: Tools, files
draft: true
---

This post is a draft, so it renders in `pnpm dev` and never ships in a
production build. It doubles as a reference for every markdown element the
article template styles. Edit it, publish it by removing `draft: true`, or
delete the file — nothing else depends on it.

## The shape

Three routes and a feed. `/` is the index: who I am, what I ship, the last three
things I wrote. `/writing` is the archive. `/writing/<slug>` is a post.

There is deliberately no `/about` — the home page opens with who I am, and a
separate page would only drain it. There are no per-product pages either,
because mambo, foyer, quietdash and blurt each already have a real site of their
own. A stub here would be thin content competing with the real thing for the
same searches.

### Frontmatter

Every post takes these keys:

- `title` and `description` are required. The description is used three times:
  as the lede under the title, as the meta description, and as the RSS summary.
- `date` is required and drives ordering, the archive grouping and the feed.
- `topic` and `product` are optional and appear on the plate beside this text.
- `draft` defaults to `false`.

## The light

The page is a lit surface rather than a flat fill. One source, top left. The
paper gradient, the direction every shadow falls, and which edges catch the
light all follow from that single position. Two sources would read as a shop
window.

> Glass only appears where something genuinely passes behind it: the sticky
> masthead, a row lifting off the page as you point at it, the plate beside this
> text as it slides along. A translucent panel over nothing is just a grey
> rectangle.

On a white ground every extra layer of glass costs contrast, which is exactly
what makes this layout readable — so there is none of it behind body text.

## The files

Posts are markdown files in `src/content/writing`. Drop one in and it appears in
the archive, on the home page, in the [feed](/rss.xml) and in the sitemap.

```bash
# a new post is a new file, and that is the whole publishing pipeline
$ $EDITOR src/content/writing/why-mambo-is-38mb.md
$ pnpm build
```

Reading time is counted from the file at build time. Nothing is stored anywhere
else, and **there is no database that owns any of this**, which is rather the
point.

1. Write the file.
2. Commit it.
3. Railway rebuilds on push.

---

A format you can read with `cat` in thirty years is not a limitation. It is the
only feature that matters.
