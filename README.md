# fberrez.co

This is my personal website [fberrez.co](https://fberrez.co).

## Tech stack

- Astro (static site)
- React (workspace island)
- Newsreader + JetBrains Mono via `@fontsource`
- `satori` + `@resvg/resvg-js` for OG image generation at build time
- nginx (production)
- Docker
- GitHub Actions (CI/CD)

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

## CI/CD Pipeline

GitHub Actions builds a Docker image, pushes it to GHCR, and deploys to a VPS via Docker Compose. Triggered manually from the Actions tab (`workflow_dispatch`).

## Infrastructure

- **Hosting**: VPS - OVH (and Railway preview)
- **Containerization**: Docker (nginx:alpine serves `dist/`)
- **Reverse Proxy**: Traefik
- **SSL**: Let's Encrypt via Traefik
- **Analytics**: self-hosted Umami at `umami.fberrez.co`
