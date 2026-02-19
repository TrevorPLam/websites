# ADR 0004: Dockerfile Standalone Output Alignment

**Status:** Accepted  
**Date:** 2026-02-15  
**Task:** 0.16

## Context

The hair-salon template Dockerfile relied on Next.js standalone output (`output: 'standalone'`) to produce a minimal container image. Two issues existed:

1. **Config mismatch:** `next.config.js` had `output: 'standalone'` commented out (per CODEBASE_AUDIT.md BUG-3), while the Dockerfile's `COPY` and `CMD` expected standalone output. Docker builds would fail with file-not-found.

2. **Build filter mismatch:** The Dockerfile used `pnpm run build --filter=@clients/starter-template`, but the package name in `package.json` is `@templates/websites`. Turbo reports "No package found with name '@clients/starter-template'", causing the build step to fail.

## Decision

1. **Keep `output: 'standalone'` enabled** in `next.config.js`. Standalone output is the recommended approach for Docker deployments: it produces a self-contained `.next/standalone/` directory with only production dependencies, reducing image size significantly (~180MB vs. full node_modules). This was already re-enabled in a prior session; verified as correct.

2. **Use path-based pnpm filter:** Change `--filter=@clients/starter-template` to `--filter=./clients/starter-template`. The path-based filter correctly targets the hair-salon template regardless of package name. Resolves the package name mismatch (see CODEBASE_AUDIT.md recommendation to rename to `@clients/starter-template`).

3. **Preserve Dockerfile structure:** Next.js 15.5+ with pnpm workspaces produces standalone output at `.next/standalone/clients/starter-template/` (directory-path nested). The existing COPY and CMD paths are correct:
   - `COPY --from=builder .../standalone ./` → places `clients/starter-template/server.js` at `/app/clients/starter-template/server.js`
   - `CMD ["node", "clients/starter-template/server.js"]` → correct entry point

## Consequences

### Positive

- Docker builds succeed in Linux (CI, production). The standalone output structure is compatible with the Dockerfile.
- Minimal container image for production deployments.
- Path-based filter is more resilient to package renames.

### Neutral

- **Windows local builds:** Next.js standalone trace step creates symlinks; Windows may fail with `EPERM: operation not permitted` when creating symlinks without admin/elevated mode. Use `next dev` for local development; Docker builds run in Linux and do not encounter this.

### Risks

- If Next.js changes standalone output structure in future major versions, Dockerfile paths may need adjustment. Monitor [vercel/next.js#84257](https://github.com/vercel/next.js/issues/84257) for monorepo standalone path changes.

## Verification

```bash
# From repo root, with Docker installed:
docker build -f clients/starter-template/Dockerfile -t hair-salon .
docker run -p 3100:3100 hair-salon
# Visit http://localhost:3100
# Health check: http://localhost:3100/api/health
```

## References

- `clients/starter-template/next.config.js`
- `clients/starter-template/Dockerfile`
- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [vercel/next.js#84257 - Standalone monorepo path issue](https://github.com/vercel/next.js/issues/84257)
- `CODEBASE_AUDIT.md` BUG-3, package name mismatch
