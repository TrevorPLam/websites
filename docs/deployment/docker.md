# Docker Deployment — Starter Template

**Last Updated:** 2026-02-18  
**Task:** 0.16, 6.3  
**Related:** `docs/adr/0004-dockerfile-standalone-output.md`, `clients/starter-template/Dockerfile`

## Overview

The starter-template uses a multi-stage Dockerfile that produces a minimal production image leveraging Next.js standalone output. The image runs the Next.js server without a full `node_modules` tree, reducing size and attack surface.

## Prerequisites

- Docker (or compatible runtime)
- Build context: monorepo root (`c:\dev\marketing-websites` or equivalent)

## Build & Run

```bash
# From monorepo root
docker build -f clients/starter-template/Dockerfile -t starter-template .

# Run (port 3101)
docker run -p 3101:3101 starter-template

# With environment variables
docker run -p 3101:3101 \
  -e NEXT_PUBLIC_SITE_URL=https://example.com \
  -e NEXT_PUBLIC_SENTRY_DSN=... \
  starter-template
```

## Environment Variables

See `.env.production.local.example` (or `.env.example`) for required variables. Key production vars:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL for metadata, sitemap |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Error tracking (Sentry) |
| `NODE_ENV` | Set by Dockerfile | Always `production` in runtime stage |

## Health Check

The image includes a HEALTHCHECK that probes `http://localhost:3101/api/health`. Orchestrators (Kubernetes, Docker Swarm, ECS) use this for readiness and liveness.

```bash
# Manual health check
curl -s http://localhost:3101/api/health
```

## Architecture

| Stage | Purpose |
|-------|---------|
| **deps** | Install pnpm workspace dependencies |
| **builder** | Build Next.js with `output: 'standalone'` |
| **runtime** | Minimal Alpine image with standalone server |

The build uses `pnpm run build --filter=@clients/starter-template` (package name matches).

## Local Development vs. Docker

- **Local dev:** Use `pnpm dev` (or `next dev`). Standalone output is only for production builds.
- **Windows:** Local `next build` may fail with symlink errors (EPERM) when generating standalone. Docker builds run in Linux and do not have this limitation.
- **CI:** Docker builds typically run on Linux (GitHub Actions `ubuntu-latest`), so symlink creation succeeds.

## Verification Checklist

- [ ] `output: 'standalone'` enabled in `clients/starter-template/next.config.js`
- [ ] Dockerfile uses `--filter=@clients/starter-template`
- [ ] `docker build` succeeds
- [ ] Container serves site at port 3101
- [ ] `/api/health` returns 200

## References

- ADR 0004: Dockerfile Standalone Output Alignment
- Next.js [Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- `clients/starter-template/Dockerfile` inline comments
