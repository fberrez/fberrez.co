# fberrez.co

This is my personal website [fberrez.co](https://fberrez.co).

## Tech stack

- Astro (static site)
- React (workspace island)
- Newsreader + JetBrains Mono via `@fontsource`
- `satori` + `@resvg/resvg-js` for OG image generation at build time
- nginx (container)
- Railway (hosting + auto-deploy on `main`)

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

| Variable                    | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| `PUBLIC_UMAMI_WEBSITE_ID`   | Umami website ID. If unset, the analytics script is omitted. |

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
