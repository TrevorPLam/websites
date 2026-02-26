---
title: Your First Project
description: Create and deploy your first marketing website using the monorepo
last_updated: 2026-02-26
tags: [#getting-started #tutorial #first-project #deployment]
estimated_read_time: 20 minutes
difficulty: beginner
---

# Your First Project

## Overview

Create your first marketing website using the monorepo's client factory system. This guide walks you through creating, customizing, and deploying a complete marketing site.

## Prerequisites

- [Development Setup](./development-setup.md) completed
- Basic understanding of React and Next.js
- GitHub account (for deployment)

## Step 1: Create a New Client

```bash
# Use the client factory CLI
pnpm create-client my-first-site

# Navigate to your new client
cd clients/my-first-site
```

This creates a complete marketing website with:
- Next.js 16 with App Router
- Tailwind CSS styling
- TypeScript configuration
- Deployment setup

## Step 2: Configure Your Site

### Basic Configuration

Edit `clients/my-first-site/site.config.ts`:

```typescript
export const siteConfig = {
  // Site identity
  name: "My First Marketing Site",
  description: "A professional marketing website",
  domain: "my-first-site.vercel.app",
  
  // Company information
  company: {
    name: "Your Company",
    phone: "+1 (555) 123-4567",
    email: "contact@example.com",
    address: "123 Business St, City, ST 12345"
  },
  
  // SEO settings
  seo: {
    title: "My First Marketing Site | Professional Services",
    description: "Professional marketing website showcasing our services",
    keywords: ["marketing", "business", "professional"],
    ogImage: "/og-image.jpg"
  },
  
  // Theme customization
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    fontFamily: "Inter"
  }
}
```

## Step 3: Customize Content

### Update Homepage Content

Edit `clients/my-first-site/app/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}
```

### Add Your Services

Update `clients/my-first-site/components/ServicesSection.tsx`:

```typescript
const services = [
  {
    title: "Web Design",
    description: "Custom website design tailored to your brand",
    icon: "🎨"
  },
  {
    title: "Digital Marketing",
    description: "Comprehensive digital marketing strategies",
    icon: "📈"
  },
  {
    title: "SEO Optimization",
    description: "Improve your search engine rankings",
    icon: "🔍"
  }
]
```

## Step 4: Test Locally

```bash
# Start development server
pnpm dev:client my-first-site

# Or navigate to client directory and run
cd clients/my-first-site
pnpm dev
```

Visit http://localhost:3000 to see your site.

## Step 5: Deploy to Production

### Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Deploy
vercel --prod
```

### Automatic Deployment

The monorepo includes automatic deployment setup:

1. Push your code to GitHub
2. Connect repository to Vercel
3. Automatic deployment on every push to main

## Step 6: Configure Custom Domain (Optional)

### In Vercel Dashboard

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Update Site Configuration

```typescript
// site.config.ts
export const siteConfig = {
  domain: "your-custom-domain.com",
  // ... rest of config
}
```

## Next Steps

- [Common Tasks](../how-to/common-tasks/) - Daily development workflows
- [Styling Guide](../guides-new/development/styling.md) - Customize appearance
- [SEO Optimization](../guides-new/integrations/seo.md) - Improve search rankings

## Troubleshooting

**Build errors:**
```bash
# Clear build cache
pnpm clean
pnpm build
```

**Deployment issues:**
```bash
# Check Vercel logs
vercel logs

# Redeploy with force
vercel --prod --force
```

## Related Resources

- [Client Factory Guide](../guides-new/development/client-factory.md)
- [Deployment Patterns](../guides-new/infrastructure/deployment.md)
- [Customization Guide](../guides-new/development/customization.md)
