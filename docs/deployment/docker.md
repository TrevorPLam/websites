# Docker Deployment — Hair Salon Template

**Last Updated:** 2026-02-15  
**Task:** 0.16  
**Related:** `docs/adr/0004-dockerfile-standalone-output.md`, `templates/hair-salon/Dockerfile`

## Overview

The hair-salon template uses a multi-stage Dockerfile that produces a minimal production image leveraging Next.js standalone output. The image runs the Next.js server without a full `node_modules` tree, reducing size and attack surface.

## Prerequisites

- Docker (or compatible runtime)
- Build context: monorepo root (`c:\dev\marketing-websites` or equivalent)

## Build & Run

```bash
# From monorepo root
docker build -f templates/hair-salon/Dockerfile -t hair-salon .

# Run (port 3100)
docker run -p 3100:3100 hair-salon

# With environment variables
docker run -p 3100:3100 \
  -e NEXT_PUBLIC_SITE_URL=https://example.com \
  -e NEXT_PUBLIC_SENTRY_DSN=... \
  hair-salon
```

## Environment Variables

See `.env.production.local.example` (or `.env.example`) for required variables. Key production vars:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL for metadata, sitemap |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Error tracking (Sentry) |
| `NODE_ENV` | Set by Dockerfile | Always `production` in runtime stage |

## Health Check

The image includes a HEALTHCHECK that probes `http://localhost:3100/api/health`. Orchestrators (Kubernetes, Docker Swarm, ECS) use this for readiness and liveness.

```bash
# Manual health check
curl -s http://localhost:3100/api/health
```

## Architecture

| Stage | Purpose |
|-------|---------|
| **deps** | Install pnpm workspace dependencies |
| **builder** | Build Next.js with `output: 'standalone'` |
| **runtime** | Minimal Alpine image with standalone server |

The build uses `pnpm run build --filter=./templates/hair-salon` (path-based filter) because the package name is `@templates/websites`; the name filter would not match.

## Local Development vs. Docker

- **Local dev:** Use `pnpm dev` (or `next dev`). Standalone output is only for production builds.
- **Windows:** Local `next build` may fail with symlink errors (EPERM) when generating standalone. Docker builds run in Linux and do not have this limitation.
- **CI:** Docker builds typically run on Linux (GitHub Actions `ubuntu-latest`), so symlink creation succeeds.

## Verification Checklist

- [ ] `output: 'standalone'` enabled in `next.config.js`
- [ ] Dockerfile uses `--filter=./templates/hair-salon` (not `@templates/hair-salon`)
- [ ] `docker build` succeeds
- [ ] Container serves site at port 3100
- [ ] `/api/health` returns 200

## References

- ADR 0004: Dockerfile Standalone Output Alignment
- Next.js [Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- `templates/hair-salon/Dockerfile` inline comments
