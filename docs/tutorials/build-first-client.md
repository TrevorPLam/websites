<!--
/**
 * @file docs/tutorials/build-first-client.md
 * @role docs
 * @summary Step-by-step tutorial for building your first client website.
 *
 * @entrypoints
 * - Referenced from learning paths
 * - Tutorial section
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/getting-started/onboarding.md (prerequisites)
 * - docs/clients/README.md (client setup)
 *
 * @used_by
 * - Template users learning to create clients
 * - Developers learning the workflow
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: tutorial instructions
 * - outputs: completed client website
 *
 * @invariants
 * - All steps must be tested and verified
 * - Instructions must be clear and actionable
 *
 * @gotchas
 * - Some steps may vary by template
 * - Environment-specific differences may apply
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add video walkthrough
 * - Create interactive tutorial
 *
 * @verification
 * - ✅ Steps verified against current codebase
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Build Your First Client Website

**Last Updated:** 2026-02-18  
**Status:** Active Tutorial  
**Estimated Time:** 1-2 hours  
**Difficulty:** Beginner  
**Prerequisites:** Basic command line knowledge, GitHub account

---

This tutorial walks you through creating your first client website from a template. By the end, you'll have a fully functional website ready for customization and deployment.

## Overview

In this tutorial, you will:

1. Choose a template
2. Create a new client project
3. Configure basic settings
4. Customize branding
5. Add content
6. Test locally
7. Prepare for deployment

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js >=22.0.0 installed
- ✅ pnpm 10.29.2 installed
- ✅ Git installed and configured
- ✅ Code editor (VS Code recommended)
- ✅ Repository cloned locally

If you need help with setup, see [Developer Onboarding](getting-started/onboarding.md).

## Step 1: Choose a Template (5 minutes)

First, let's see what templates are available:

```bash
# Navigate to repository root
cd marketing-websites

# List available clients
ls clients/
```

You should see clients like:
- `starter-template/` - Golden-path template (clone for new projects)
- `luxe-salon/` - Example: salon industry
- (More clients as they're added)

For this tutorial, we'll use the `starter-template` as the base.

## Step 2: Create Client Project (5 minutes)

Create a new client from the template:

```bash
# Create client directory
mkdir -p clients/my-first-client

# Copy starter-template to client directory
cp -r clients/starter-template/* clients/my-first-client/

# Navigate to client directory
cd clients/my-first-client
```

**Alternative:** If you prefer a different name, replace `my-first-client` with your desired client name.

## Step 3: Add to Workspace (2 minutes)

Add the new client to the pnpm workspace:

Edit `pnpm-workspace.yaml` in the repository root and add:

```yaml
packages:
  - 'packages/*'
  - 'clients/*'   # Already includes my-first-client
```

## Step 4: Install Dependencies (5 minutes)

Install dependencies for your new client:

```bash
# From repository root
pnpm install
```

This installs dependencies for all packages and your new client.

## Step 5: Configure Environment Variables (5 minutes)

Set up environment variables:

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your editor
# Add your configuration values
```

Minimum required variables (see `.env.example` for full list):

```env
# Site Configuration
NEXT_PUBLIC_SITE_NAME=My First Client
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Supabase (if using database features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Step 6: Configure Site Settings (10 minutes)

Edit `site.config.ts` to customize your client:

```typescript
import { defineConfig } from '@repo/types'

export default defineConfig({
  site: {
    name: 'My First Client',
    url: 'https://myfirstclient.com',
    description: 'A beautiful website built with marketing-websites',
  },
  branding: {
    logo: '/logo.png',
    favicon: '/favicon.ico',
  },
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#7928ca',
      // ... customize colors
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  // ... more configuration
})
```

**Tip:** Start with the default configuration and customize gradually.

## Step 7: Customize Branding (15 minutes)

### Update Colors

Edit `site.config.ts` theme colors:

```typescript
theme: {
  colors: {
    primary: '#your-brand-color',
    secondary: '#your-secondary-color',
    // Add your brand colors
  },
}
```

### Add Logo

1. Place your logo file in `public/logo.png`
2. Update `site.config.ts`:
   ```typescript
   branding: {
     logo: '/logo.png',
   }
   ```

### Update Fonts

Choose fonts from [Google Fonts](https://fonts.google.com) or use system fonts:

```typescript
theme: {
  fonts: {
    heading: 'Your Heading Font',
    body: 'Your Body Font',
  },
}
```

## Step 8: Customize Content (20 minutes)

### Update Business Information

Edit `site.config.ts`:

```typescript
business: {
  name: 'Your Business Name',
  address: '123 Main St, City, State ZIP',
  phone: '(555) 123-4567',
  email: 'hello@yourbusiness.com',
  hours: {
    monday: '9:00 AM - 5:00 PM',
    // ... add hours
  },
}
```

### Update Pages

Edit page files in `app/` directory:

- `app/page.tsx` - Home page
- `app/about/page.tsx` - About page
- `app/services/page.tsx` - Services page
- `app/contact/page.tsx` - Contact page

### Add Services

Update services in `site.config.ts` or create a services data file:

```typescript
services: [
  {
    name: 'Service 1',
    description: 'Service description',
    price: '$99',
  },
  // Add more services
]
```

## Step 9: Start Development Server (2 minutes)

Start the development server:

```bash
# From client directory
pnpm dev --port 3001
```

**Note:** Use a unique port (3001, 3002, etc.) if running multiple clients.

Open your browser to `http://localhost:3001` to see your site!

## Step 10: Verify Everything Works (10 minutes)

Check the following:

- ✅ Home page loads correctly
- ✅ Navigation works
- ✅ Branding (colors, logo) displays
- ✅ Content is correct
- ✅ Forms work (if applicable)
- ✅ No console errors
- ✅ Mobile responsive

### Common Issues

**Port already in use:**
```bash
# Use a different port
pnpm dev --port 3002
```

**Styles not loading:**
- Check that Tailwind config includes your files
- Restart dev server

**Build errors:**
- Run `pnpm type-check` to see TypeScript errors
- Run `pnpm lint` to see lint errors

See [Troubleshooting Guide](getting-started/troubleshooting.md) for more help.

## Step 11: Build for Production (5 minutes)

Test the production build:

```bash
# Build the client
pnpm build

# If build succeeds, start production server
pnpm start
```

Verify the production build works correctly.

## Step 12: Prepare for Deployment (10 minutes)

### Choose Deployment Platform

Options:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Docker** (self-hosted)
- **Other platforms**

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Build command: `pnpm build`
- [ ] Output directory: `.next`
- [ ] Node.js version: >=22.0.0
- [ ] Custom domain configured (optional)

See [Deployment Guide](../deployment/) for platform-specific instructions.

## Next Steps

Congratulations! You've built your first client website. Now you can:

1. **Customize further** - Add more pages, features, and content
2. **Deploy** - Follow deployment guide for your platform
3. **Learn more** - Explore [Component Documentation](../components/)
4. **Contribute** - Consider contributing improvements back

## Troubleshooting

If you encounter issues:

1. Check [Troubleshooting Guide](getting-started/troubleshooting.md)
2. Review [FAQ](../resources/faq.md)
3. Search [GitHub Issues](https://github.com/your-org/marketing-websites/issues)

## Summary

In this tutorial, you learned to:

- ✅ Create a client from a template
- ✅ Configure site settings
- ✅ Customize branding and content
- ✅ Run development server
- ✅ Build for production
- ✅ Prepare for deployment

## Related Resources

- [Client Setup Guide](../clients/README.md)
- [Configuration Guide](../CONFIG.md)
- [Deployment Guide](../deployment/)
- [Developer Onboarding](../getting-started/onboarding.md)

---

**Ready for more?** Try the [Create a Custom Component](../tutorials/create-component.md) tutorial next!
