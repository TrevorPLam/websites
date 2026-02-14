# Hair Salon Template — Production Dockerfile
# [Task 0.4.3] Pinned pnpm version, added non-root user, added HEALTHCHECK

# Stage 1: Dependencies
FROM node:24-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY templates/hair-salon/package.json ./templates/hair-salon/

RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.pnpm-store ./.pnpm-store
COPY . .

RUN pnpm run build --filter=@templates/hair-salon

# Stage 3: Runtime
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

# [Task 0.4.3] Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/templates/hair-salon/.next/standalone ./
COPY --from=builder /app/templates/hair-salon/.next/static ./templates/hair-salon/.next/static
COPY --from=builder /app/templates/hair-salon/public ./templates/hair-salon/public

USER nextjs

EXPOSE 3100

# [Task 0.4.3] HEALTHCHECK for container orchestration (depends on 1.6.1 health endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3100/api/health || exit 1

CMD ["node", "templates/hair-salon/server.js"]
