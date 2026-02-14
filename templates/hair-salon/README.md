# Hair Salon Template

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Template Type:** Hair Salon / Beauty Salon

This is the base hair salon template. To create a client project, copy this template to the `clients/` directory.

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# Runs on http://localhost:3100
```

### Building

```bash
pnpm build
pnpm start
```

## Creating a Client Project

```bash
# Copy this template to clients directory
cp -r templates/hair-salon clients/[client-name]

# Navigate to client
cd clients/[client-name]

# Update package.json name to @clients/[client-name]

# Configure environment
cp .env.example .env.local
# Edit .env.local with client-specific values

# Install and run
pnpm install
pnpm dev --port 3001
```

## Template Features

### Core Features

- ✅ **Online Booking System** - Service selection, date/time picker, CRM integration
- ✅ **Service Pages** - Haircuts, coloring, treatments, special occasions
- ✅ **Team Profiles** - Stylist bios, photos, specialties
- ✅ **Blog System** - MDX-powered blog with categories and search
- ✅ **Gallery** - Portfolio showcase with optimized images
- ✅ **Contact Forms** - Validated forms with rate limiting
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data
- ✅ **Performance** - Server-side rendering, image optimization
- ✅ **Security** - CSP, security headers, input validation

### Integrations

- HubSpot CRM
- Supabase (PostgreSQL)
- Google Analytics
- Upstash Redis (rate limiting)

## Customization Points

When creating a client project, customize these files:

### 1. Branding

- **`tailwind.config.js`** - Update colors, fonts
- **`public/logo.svg`** - Replace with client logo
- **`app/layout.tsx`** - Update metadata, fonts

### 2. Content

- **`app/services/`** - Update service offerings
- **`app/team/page.tsx`** - Add team members
- **`app/about/page.tsx`** - Client story and values
- **`content/blog/`** - Add blog posts
- **`public/images/`** - Upload client images

### 3. Configuration

- **`.env.local`** - Set environment variables
- **`next.config.js`** - Adjust if needed
- **`middleware.ts`** - Configure CSP if needed

### 4. Features

Enable/disable features via environment variables:

- `NEXT_PUBLIC_ENABLE_BOOKING`
- `NEXT_PUBLIC_ENABLE_BLOG`
- `NEXT_PUBLIC_ENABLE_GALLERY`

## Environment Variables

See `.env.example` for all available environment variables.

Required variables:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3100
NEXT_PUBLIC_SITE_NAME="Your Salon Name"
NEXT_PUBLIC_BUSINESS_NAME="Your Business"
NEXT_PUBLIC_BUSINESS_PHONE="(555) 123-4567"
NEXT_PUBLIC_BUSINESS_EMAIL="info@yoursalon.com"
```

## Technology Stack

- **Framework:** Next.js 15.2.9 (App Router)
- **UI:** React 19.0.0
- **Styling:** Tailwind CSS 3.4.17
- **Language:** TypeScript 5.7.2
- **Forms:** React Hook Form + Zod
- **Content:** MDX with next-mdx-remote
- **Icons:** Lucide React

## Directory Structure

```
hair-salon/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── blog/              # Blog pages
│   ├── book/              # Booking page
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   ├── pricing/           # Pricing page
│   ├── services/          # Service pages
│   └── team/              # Team page
├── components/            # Shared components
├── features/              # Feature modules
│   ├── analytics/         # Analytics & tracking
│   ├── blog/              # Blog functionality
│   ├── booking/           # Booking system
│   ├── contact/           # Contact forms
│   └── hubspot/           # HubSpot integration
├── lib/                   # Utilities & helpers
├── public/                # Static assets
└── content/               # Content files (MDX)
```

## Development Notes

### Port Configuration

- Template dev server: `http://localhost:3100`
- Client projects should use different ports (3001, 3002, etc.)

### Shared Packages

This template uses shared packages:

- `@repo/ui` - Core UI components
- `@repo/utils` - Utility functions
- `@repo/eslint-config` - ESLint configuration
- `@repo/typescript-config` - TypeScript configuration

### Shared Template Components

Consider extracting commonly used features to `templates/shared/` for reuse across templates.

## Documentation

- **[Template Documentation](../../docs/templates/hair-salon.md)** - Detailed template guide
- **[Client Setup Guide](../../docs/clients/README.md)** - Client implementation guide
- **[Architecture](../../docs/architecture/TEMPLATE_ARCHITECTURE.md)** - System architecture

## Support

For template questions:

1. Review [template documentation](../../docs/templates/hair-salon.md)
2. Check [shared components](../shared/README.md)
3. See [architecture docs](../../docs/architecture/)

---

**Template Version:** 1.0.0  
**Last Updated:** 2026-02-10  
**Maintained By:** Development Team
