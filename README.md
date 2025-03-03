# fberrez.co

This is my personal website [fberrez.co](https://fberrez.co).

## Tech stack

- Next.js
- Tailwind CSS
- Radix UI
- Lucide Icons
- Plausible Analytics
- Docker
- GitHub Actions (CI/CD)

## Getting started

### Local development

```bash
# Install dependencies
$ pnpm install

# Start development server
$ pnpm dev
```

### Docker deployment

The project is containerized with Docker and can be deployed using Docker Compose:

```bash
# Build and start the container
$ docker compose up -d

# View logs
$ docker compose logs -f
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. When code is pushed to the `main` branch, a GitHub Action workflow is triggered
2. The workflow builds a Docker image and pushes it to GitHub Container Registry
3. The image is then deployed to a VPS using Docker Compose
4. Traefik handles routing and SSL termination

## Infrastructure

- **Hosting**: VPS - OVH
- **Containerization**: Docker
- **Reverse Proxy**: Traefik
- **SSL**: Let's Encrypt via Traefik
- **Analytics**: Plausible Analytics