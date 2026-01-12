# Cloudflare Deployment Guide

Last Updated: 2026-01-12

## Overview

This Next.js application is configured to deploy to Cloudflare Pages using the `@cloudflare/next-on-pages` adapter.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already installed in devDependencies
3. **Git Repository**: Your code should be in a Git repository

## Quick Start

### Option 1: Deploy via Cloudflare Dashboard (Recommended for first deployment)

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to Pages

2. **Create a New Project**
   - Click "Create a project"
   - Connect your GitHub/GitLab repository
   - Select your repository: `TrevorPLam/your-dedicated-marketer`

3. **Configure Build Settings**
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (leave empty if repo root)
   - **Node version**: `20` (set in Environment Variables: `NODE_VERSION=20`)

4. **Set Environment Variables** (in Cloudflare Dashboard)
   ```
   CLOUDFLARE_BUILD=true
   NODE_VERSION=20
   UPSTASH_REDIS_REST_URL=<your-url>
   UPSTASH_REDIS_REST_TOKEN=<your-token>
   RESEND_API_KEY=<your-key>
   SENTRY_DSN=<your-dsn>
   SENTRY_ORG=<your-org>
   SENTRY_PROJECT=<your-project>
   SENTRY_AUTH_TOKEN=<your-token>
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Your app will build and deploy automatically

### Option 2: Deploy via Wrangler CLI

1. **Authenticate with Cloudflare**
   ```bash
   npx wrangler login
   ```

2. **Build for Cloudflare**
   ```bash
   npm run pages:build
   ```

3. **Preview Locally**
   ```bash
   npm run pages:preview
   ```

4. **Deploy to Production**
   ```bash
   npx wrangler pages deploy .vercel/output/static --project-name=your-dedicated-marketer
   ```

5. **Set Environment Variables** (via CLI)
   ```bash
   # Set secrets (for sensitive data)
   npx wrangler pages secret put RESEND_API_KEY --project-name=your-dedicated-marketer
   npx wrangler pages secret put UPSTASH_REDIS_REST_TOKEN --project-name=your-dedicated-marketer
   
   # Set environment variables (for non-sensitive data)
   npx wrangler pages secret put NEXT_PUBLIC_GOOGLE_ANALYTICS_ID --project-name=your-dedicated-marketer
   ```

## Environment Variables

### Required

- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `RESEND_API_KEY` - Resend API key for email functionality

### Optional

- `SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_ORG` - Sentry organization
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry auth token
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `NEXT_PUBLIC_MICROSOFT_CLARITY_ID` - Microsoft Clarity ID
- `NEXT_PUBLIC_HOTJAR_ID` - Hotjar ID

### Local Development

1. Copy `.dev.vars.example` to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Fill in your values in `.dev.vars`

3. Run local Cloudflare preview:
   ```bash
   npm run pages:preview
   ```

## Continuous Deployment

Once you've connected your Git repository to Cloudflare Pages:

- **Automatic deploys**: Every push to `main` triggers a production deployment
- **Preview deploys**: Pull requests get preview URLs automatically
- **Rollback**: Use Cloudflare Dashboard to rollback to previous deployments

## Custom Domain

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the DNS configuration instructions

## Important Notes

### Image Optimization

Cloudflare Pages doesn't support Next.js Image Optimization API out of the box. The config is set to use `unoptimized: true` during Cloudflare builds. Options:

1. **Use unoptimized images** (current setup)
2. **Use Cloudflare Images** - Set up a custom image loader
3. **Use external image CDN** - Configure remote patterns

### Limitations

- **No Node.js runtime**: Cloudflare Workers use V8 isolates (not Node.js)
- **Edge runtime only**: Server functions must be edge-compatible
- **No fs module**: File system access not available at runtime
- **Cold starts**: First request may be slower

### Compatibility

Check [Cloudflare's documentation](https://developers.cloudflare.com/pages/framework-guides/nextjs/) for supported Next.js features.

## Troubleshooting

### Build fails

- Check Node.js version is set to 20 in environment variables
- Ensure all dependencies are in `dependencies` (not just `devDependencies`)
- Review build logs in Cloudflare Dashboard

### Runtime errors

- Check environment variables are set correctly
- Ensure edge runtime compatibility for API routes
- Review Sentry logs for error details

### Rate limiting not working

- Verify Upstash Redis credentials are set
- Check Upstash Redis is accessible from Cloudflare
- Review network logs in browser dev tools

## Monitoring

- **Cloudflare Analytics**: Built-in analytics in Cloudflare Dashboard
- **Sentry**: Error tracking and performance monitoring
- **Upstash**: Redis metrics and rate limiting stats

## Rollback

If something goes wrong:

1. Go to Cloudflare Dashboard > Pages > Your Project
2. Click "View build history"
3. Select a previous successful deployment
4. Click "Rollback to this deployment"

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

## Cost

- **Cloudflare Pages Free Tier**:
  - 500 builds per month
  - Unlimited requests
  - Unlimited bandwidth
  - 100 custom domains

- **Paid Plans**: Available for higher usage

---

For more information, see the [official Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).
