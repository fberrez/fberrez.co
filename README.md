# fberrez.co

Personal site for [Florent Berrez](https://fberrez.co), built with Astro and served by nginx on Railway.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Profile, live products, contact links |
| `/min-one/privacy` | Privacy policy for the min.one iOS app |

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

The build generates the favicon, social card, static pages, and sitemap in `dist/`.

## Environment

| Variable | Purpose |
| --- | --- |
| `PUBLIC_UMAMI_WEBSITE_ID` | Self-hosted Umami analytics site ID |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token |

Railway watches `main`, builds the Docker image, and serves `dist/` through nginx.
