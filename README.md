# fberrez.co

This is my personal website [fberrez.co](https://fberrez.co).

## Tech stack

- Astro (static site)
- IBM Plex Mono + Source Serif 4 via `@fontsource`
- Content Collections for the writing, `@astrojs/rss` for the feed
- `satori` + `@resvg/resvg-js` for OG image generation at build time
- nginx (container)
- Railway (hosting + auto-deploy on `main`)

## Structure

Three routes and a feed:

| Route              | What it is                                                |
| ------------------ | --------------------------------------------------------- |
| `/`                | Profile, the product table, the last three posts, contact  |
| `/writing`         | Full archive, grouped by year once there is more than one  |
| `/writing/<slug>`  | A post                                                     |
| `/rss.xml`         | Feed                                                       |

There is no `/about` — the home page opens with it — and no per-product pages,
since each product has its own site and a stub here would compete with it.

## Writing a post

Drop a markdown file in `src/content/writing/`. It appears in the archive, on
the home page, in the feed and in the sitemap. Reading time is counted from the
file at build time.

```yaml
---
title: Why mambo ships as a 38 MB binary
description: One line, used as the lede, the meta description and the RSS summary.
date: 2026-07-12
topic: Tools, files   # optional, shown on the article's spec plate
product: mambo        # optional
draft: false          # drafts render in dev, never in a production build
unlisted: false       # ships with a URL, but nothing links to it
---
```

### `draft` vs `unlisted`

Two different ways to hold a post back:

| Flag             | Has a URL in production | Appears in archive / home / RSS / sitemap | Robots     |
| ---------------- | ----------------------- | ----------------------------------------- | ---------- |
| `draft: true`    | No, dev only            | No                                        | —          |
| `unlisted: true` | **Yes**                 | No                                        | `noindex`  |
| neither          | Yes                     | Yes                                       | `index`    |

`unlisted` is for handing someone a link before the piece is meant to be found.
The page and its social card build normally, so the link previews properly, but
`getPosts()` filters it out and every listing on the site reads from that one
function. Routes that need it anyway call `getRoutablePosts()`.

The sitemap is decided in `astro.config.mjs`, which re-reads the frontmatter off
disk because the integration is configured before the content collection is
readable. If you add a third flag, it needs teaching there too.

## Getting started

### Local development

```bash
# Install dependencies
$ pnpm install

# Start dev server
$ pnpm dev

# Build the OG image + static site to dist/
$ pnpm build

# Preview the built site
$ pnpm preview
```

### Environment

| Variable                           | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `PUBLIC_UMAMI_WEBSITE_ID`          | Umami website ID. If unset, the analytics script is omitted.       |
| `PUBLIC_GOOGLE_SITE_VERIFICATION`  | Search Console "HTML tag" token. If unset, the tag is omitted.     |

### Docker deployment

The project is containerized with Docker and served via nginx:

```bash
$ docker compose up -d
$ docker compose logs -f
```

## Deployment

Railway watches the `main` branch and rebuilds the Docker image on every push, then deploys it. There is also a `.github/workflows/deploy.yml` workflow (disabled, `workflow_dispatch` only) that was used for the previous OVH VPS setup — kept for reference.

## Infrastructure

- **Hosting**: [Railway](https://railway.app) — service `fberrez-co` in project `fberrez.co`
- **Containerization**: Docker (`nginx:alpine` serves `dist/`)
- **Analytics**: self-hosted Umami at `umami.fberrez.co`
