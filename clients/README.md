# Clients Directory

This directory contains client implementations for the marketing websites platform. As of 2026-02-21, this directory has been simplified to contain a single testing template.

## Purpose

The `clients/` directory allows you to:

- Create and manage client projects based on a minimal, working template
- Share common code via packages and templates
- Deploy each client independently
- Maintain consistent development workflow
- Focus on quality over quantity of templates

## Structure (Post-Simplification)

```
clients/
├── testing-not-a-client/    # Single testing template with working functionality
├── AGENTS.md                 # AI agent configurations
├── AGENTS.override.md       # Agent overrides
└── README.md                 # This file
```

## Session Changes (2026-02-21)

**Removed Templates:**

- ❌ starter-template (was golden-path template)
- ❌ luxe-salon (salon industry example)
- ❌ bistro-central (restaurant example)
- ❌ chen-law (law firm example)
- ❌ sunrise-dental (dental example)
- ❌ urban-outfitters (retail example)

**Added:**

- ✅ testing-not-a-client (minimal, working template)

**Rationale:**

- Reduced complexity from 6 templates to 1
- Focus on quality over quantity
- Single template demonstrates all working functionality
- Easier maintenance and documentation
- Clear starting point for custom development

## Creating a New Client Project

### Step 1: Copy the Testing Template

Copy the testing-not-a-client template to create a new client:

```bash
# Copy testing template as the base for any new client
cp -r clients/testing-not-a-client clients/[client-name]
```

The testing template includes working contact forms, booking system, blog functionality, and all critical features.

### Step 2: Update Package Configuration

Edit `clients/[client-name]/package.json`:

```json
{
  "name": "@clients/[client-name]",
  "version": "1.0.0",
  "private": true,
  "description": "[Client Name] website",
  "scripts": {
    "dev": "next dev --port [unique-port]",
    "build": "next build",
    "start": "next start --port [unique-port]",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

**Important:** Assign a unique port for dev server (e.g., 3001, 3002, 3003).

### Step 3: Add to Workspace

Add the client to `pnpm-workspace.yaml` in the root:

```yaml
packages:
  - 'packages/*'
  - 'packages/config/*'
  - 'packages/integrations/*'
  - 'packages/features/*'
  - 'packages/ai-platform/*'
  - 'packages/content-platform/*'
  - 'packages/marketing-ops/*'
  - 'packages/infrastructure/*'
  - 'clients/*'
  - 'apps/*'
  - 'tooling/*'
```

> **Note:** Ensure `package.json` workspaces match `pnpm-workspace.yaml` when adding packages.

### Step 4: Configure Environment Variables

Create `clients/[client-name]/.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://[client-domain].com
NEXT_PUBLIC_SITE_NAME="[Client Name]"

# Business Information
NEXT_PUBLIC_BUSINESS_NAME="[Client Business Name]"
NEXT_PUBLIC_BUSINESS_PHONE="(XXX) XXX-XXXX"
NEXT_PUBLIC_BUSINESS_EMAIL="contact@[client-domain].com"

# API Keys
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
HUBSPOT_API_KEY=your-hubspot-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key

# Feature Flags
NEXT_PUBLIC_ENABLE_BOOKING=true
NEXT_PUBLIC_ENABLE_BLOG=true
```

### Step 5: Customize Branding

Update the following files in `clients/[client-name]/`:

#### Tailwind Configuration (`tailwind.config.js`)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          // ... client's brand colors
        },
        secondary: {
          // ... secondary colors
        },
      },
      fontFamily: {
        sans: ['Client Font', 'sans-serif'],
      },
    },
  },
};
```

#### Site Metadata (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: '[Client Name]',
  description: '[Client business description]',
  // ... other metadata
};
```

### Step 6: Update Content

1. **Services** - Update service offerings in `app/services/`
2. **Team** - Add team member profiles in `app/team/`
3. **About** - Customize business story in `app/about/`
4. **Contact** - Update contact information in `app/contact/`
5. **Blog** - Add client-specific blog content in `content/blog/`
6. **Images** - Replace placeholder images in `public/`

### Step 7: Install and Run

```bash
# Install dependencies
pnpm install

# Run in development
cd clients/[client-name]
pnpm dev

# Or run from root
pnpm --filter @clients/[client-name] dev
```

## Client Project Structure

Each client project follows this structure (starter-template uses `app/[locale]/` for i18n; others may use flat `app/`):

```
client-name/
├── package.json              # @clients/client-name, depends on @repo/*
├── site.config.ts            # THE central config (features, theme, integrations)
├── .env.local                # Environment variables (gitignored)
├── .env.example              # Example environment file
├── next.config.js or .ts     # Next.js configuration
├── tailwind.config.js        # Customized theme (or Tailwind 4 postcss)
├── tsconfig.json             # TypeScript config
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── [locale]/            # (starter-template: i18n routes)
│   │   ├── layout.tsx       # Locale layout
│   │   ├── page.tsx         # Home
│   │   ├── about/           # About page
│   │   ├── services/        # Services page
│   │   ├── contact/         # Contact page
│   │   ├── book/            # Booking page
│   │   └── blog/            # Blog
│   └── globals.css
├── i18n/                     # (starter-template: next-intl routing)
├── components/               # Client-specific components
├── public/                   # Static assets
└── messages/                 # (starter-template: i18n message files)
```

## Development Workflow

### Running Multiple Clients

```bash
# Run specific client
pnpm --filter @clients/[client-name] dev

# Run all clients (use unique ports!)
pnpm --filter "@clients/*" dev

# Build specific client
pnpm --filter @clients/[client-name] build
```

### Shared Dependency Updates

When updating shared packages (`@repo/ui`, `@repo/utils`), all clients automatically benefit:

```bash
# Update shared UI package
cd packages/ui
# Make changes...

# Rebuild all clients
pnpm --filter "@clients/*" build
```

## Deploying Clients

Each client can be deployed independently:

### Vercel Deployment

1. Connect repository to Vercel
2. Configure project:
   - **Root Directory:** `clients/[client-name]`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker Deployment

Only `starter-template` has a Dockerfile. From monorepo root:

```bash
docker build -f clients/starter-template/Dockerfile -t starter-template .
docker run -p 3101:3101 starter-template
```

### Other Platforms

Clients can be deployed to:

- Netlify
- AWS Amplify
- Google Cloud
- Azure Static Web Apps
- Self-hosted servers

## Customization Guidelines

### What to Customize

✅ **Always customize:**

- Branding (colors, fonts, logo)
- Content (pages, blog, images)
- Business information
- Contact details
- Service offerings
- Team members
- Environment variables

✅ **Customize as needed:**

- Layout and page structure
- Component styling
- Feature enablement
- Third-party integrations
- Custom functionality

### What NOT to Modify

❌ **Avoid changing:**

- Core template structure (unless necessary)
- Shared package code (modify in packages/ instead)
- Build configuration (unless required)

### When to Create Custom Code

Create custom components/features in client directory when:

1. Feature is specific to this client only
2. Differs significantly from template
3. One-off business requirement
4. Client-specific integrations

Keep shared code in:

- `packages/` - For universal utilities, UI, features
- `packages/marketing-components/` - For industry-agnostic marketing sections
- `packages/features/` - For booking, contact, blog, services, search

## Client Documentation

Each client should have its own `README.md` with:

- Client contact information
- Deployment instructions
- Custom feature documentation
- Environment variable guide
- Content update procedures
- Maintenance notes

## Example Clients

See `clients/starter-template/` for the golden-path reference. See `clients/luxe-salon/`, `clients/bistro-central/`, etc. for industry-specific examples.

## Validation

Before committing client changes, run validation to ensure CaCA compliance:

```bash
# Validate a single client
pnpm validate-client clients/luxe-salon

# Validate all clients (same as CI)
pnpm validate-all-clients
```

Validation checks: `package.json` (@clients/ name, dev/build/type-check scripts), `site.config.ts` (required fields, export default), Next.js/tsconfig, app layout and page structure, and cross-client import detection.

## Best Practices

1. **Use unique ports** - Assign different dev ports to avoid conflicts
2. **Document customizations** - Keep notes on what differs from template
3. **Keep dependencies updated** - Regularly update packages
4. **Test thoroughly** - Test all features before deploying
5. **Version control** - Commit client-specific changes separately
6. **Environment security** - Never commit `.env.local` files
7. **Performance monitoring** - Set up analytics and monitoring
8. **Regular backups** - Back up client databases and content

## Troubleshooting

### Port Conflicts

If you get `EADDRINUSE` errors, change the port in `package.json`:

```json
"dev": "next dev --port 3002"
```

### Build Errors

Ensure all dependencies are installed:

```bash
pnpm install --filter @clients/[client-name]
```

### Type Errors

Regenerate TypeScript types:

```bash
pnpm --filter @clients/[client-name] type-check
```

## Support

For questions or issues:

1. Run `pnpm validate-all-clients` to verify client config
2. Review architecture docs in `docs/architecture/`
3. Consult [getting-started/onboarding.md](../docs/getting-started/onboarding.md)
4. Contact team lead or senior developer

---

**Last Updated:** 2026-02-18
