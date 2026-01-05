# Local Development Setup

> **Last Updated:** 2026-01-05  
> **Canonical Status:** Canonical  
> **Purpose:** Step-by-step local development setup guide  
> **See Also:** [Project README](../start-here/README.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [DOCS_INDEX.md](../DOCS_INDEX.md)

## Prerequisites
- Node.js 20.x LTS or higher
- npm (use `package-lock.json`)
- Git

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/ydFirms/Your-Dedicated-Marketer.git
cd Your-Dedicated-Marketer
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
```bash
cp env.example .env.local
# Edit .env.local with required values:
# - RESEND_API_KEY: Get from Resend dashboard
# - CONTACT_EMAIL: Email address to receive contact form submissions
```

### 4. Start Development Server
```bash
npm run dev
```

## Verification
- Site running at: http://localhost:3000
- All pages should load without errors
- Contact form should validate input

## Common Issues

**Problem**: `npm install` fails with permission errors  
**Solution**: Ensure you have write access to the project directory and retry

**Problem**: Images not loading in development  
**Solution**: Check that images are in `public/` directory and referenced with leading slash

**Problem**: Build fails with TypeScript errors  
**Solution**: Run `npm run type-check` to see full error details

**Problem**: Contact form doesn't send emails  
**Solution**: Verify RESEND_API_KEY is set correctly in .env

## Additional Tools
- **Linting**: `npm run lint` (ESLint + TypeScript)
- **Type checking**: `npm run type-check` (TypeScript compiler)
- **Testing**: `npm test` (Vitest)
- **Coverage**: `npm run test:coverage` (requires `@vitest/coverage-v8`, outputs to `coverage/`)
- **Building**: `npm run build` (Next.js production build)
- **Local production run**: `npm run start` (after build)

## Development Workflow

### Adding New Pages
```bash
# Create new page in app directory
touch app/new-page/page.tsx

# Page will be automatically routed at /new-page
```

### Adding Blog Posts
```bash
# Create new MDX file in content/blog
touch content/blog/post-title.mdx

# Add frontmatter (title, date, description, etc.)
# Write content in Markdown
```

### Deploying to Production
```bash
# Build and test locally first
npm run build
npm run start

# Push to main branch
git push origin main

# Cloudflare Pages will automatically build and deploy
```

## Project Structure
```
Your-Dedicated-Marketer/
├── app/                  # Next.js App Router pages
├── components/           # React components
├── content/             # MDX blog posts
├── public/              # Static assets
├── styles/              # Global styles
└── lib/                 # Utilities and helpers
```
