#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Bootstrapping local environment"

pnpm install

if [[ ! -f .env.local && -f .env.example ]]; then
  cp .env.example .env.local
  echo "✅ Created .env.local from .env.example"
fi

echo "🐘 Starting Supabase"
pnpm exec supabase start

echo "🗃️ Applying migrations"
pnpm exec supabase db push --local

echo "🌱 Seeding sample data"
pnpm exec tsx scripts/seed.ts

echo "🎭 Installing Playwright chromium"
pnpm exec playwright install chromium

echo "🏗️ Building shared packages"
pnpm --filter './packages/**' build

echo "\n✅ Environment setup complete"
