# Starter Template — Production Dockerfile
# Build: docker build -f clients/starter-template/Dockerfile -t starter-template .
# See: docs/deployment/docker.md

# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY clients/starter-template/package.json ./clients/starter-template/

RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.pnpm-store ./.pnpm-store
COPY . .

RUN pnpm run build --filter=@clients/starter-template

# Stage 3: Runtime
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/clients/starter-template/.next/standalone ./
COPY --from=builder /app/clients/starter-template/.next/static ./clients/starter-template/.next/static
COPY --from=builder /app/clients/starter-template/public ./clients/starter-template/public

USER nextjs

EXPOSE 3101

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3101/api/health || exit 1

CMD ["node", "clients/starter-template/server.js"]
