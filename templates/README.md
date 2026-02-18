# Templates Directory

This directory contains reusable business templates that can be used as starting points for client projects.

## Available Templates

### Hair Salon Template

**Location:** `templates/hair-salon/`

Complete hair salon website template with:

- Online booking system
- Service showcase pages
- Team member profiles
- Blog with MDX support
- Contact forms with CRM integration
- Gallery and portfolio display
- SEO-optimized pages

**Tech Stack:**

- Next.js 16.1.0 (App Router)
- React 19.0.0
- TypeScript 5.7.2
- Tailwind CSS 4.1.0
- Supabase integration
- HubSpot CRM integration

### Nail Salon Template

**Location:** `templates/nail-salon/` _(Coming Soon)_

Template optimized for nail salons with similar features adapted for nail services.

### Tanning Salon Template

**Location:** `templates/tanning-salon/` _(Coming Soon)_

Template optimized for tanning salons with membership and package features.

### Shared Template Components

**Location:** `templates/shared/`

Common components, utilities, and features shared across all templates:

- Booking system core
- Contact form components
- Analytics integration
- Authentication helpers
- Common UI patterns

## Using a Template

### For New Clients

1. **Copy a template** to the `clients/` directory:

   ```bash
   cp -r templates/hair-salon clients/[client-name]
   ```

2. **Customize** the client implementation:

   - Update branding (colors, logos, fonts)
   - Configure business-specific data
   - Customize features as needed
   - Set up environment variables

3. **Add to workspace** in `pnpm-workspace.yaml`:

   ```yaml
   packages:
     - 'clients/[client-name]'
   ```

4. **Deploy** the client project independently

### Creating New Templates

1. Create a new directory under `templates/`
2. Follow the existing template structure
3. Leverage `templates/shared/` components
4. Document template-specific features
5. Add to this README

## Template Structure

Each template should follow this structure:

```
template-name/
├── package.json           # Template-specific dependencies
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
├── README.md              # Template documentation
├── app/                   # Next.js app directory
│   ├── layout.tsx
│   ├── page.tsx
│   └── [routes]/
├── components/            # Template-specific components
├── features/              # Business logic & features
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── content/               # Content (blog posts, etc.)
```

## Best Practices

1. **Keep templates generic** - Avoid hardcoded business-specific data
2. **Document customization points** - Make it easy for developers to adapt
3. **Share common code** - Use `templates/shared/` for reusable features
4. **Version templates** - Track major changes that affect client projects
5. **Test thoroughly** - Ensure all features work before releasing
6. **Maintain consistency** - Follow similar patterns across templates

## Contributing

When adding or modifying templates:

1. Update this README
2. Document changes in template-specific README
3. Update `docs/templates/` with detailed guides
4. Test template with a sample client project
5. Update version and changelog

---

**Last Updated:** 2026-02-10
