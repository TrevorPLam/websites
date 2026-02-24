# 🏢 Clients

> **Individual client sites and configurations for the marketing websites platform**

This directory contains individual client websites, each with their own configuration, content, and customizations. Each client is a fully functional Next.js application that inherits shared components and business logic from the monorepo packages.

---

## 📁 Client Structure

```
clients/
├── client-name-1/           # Individual client site
│   ├── app/                 # Next.js application
│   ├── content/             # Client-specific content
│   ├── site.config.ts       # Client configuration
│   ├── package.json        # Client dependencies
│   └── README.md           # Client documentation
├── client-name-2/           # Another client site
└── testing-not-a-client/    # Test client for development
```

---

## 🎯 Client Overview

### **Client Architecture**

Each client follows a standardized architecture:

#### **Application Structure** (`app/`)

```
app/
├── layout.tsx              # Root layout with client branding
├── page.tsx                # Home page with client content
├── globals.css              # Client-specific styles
├── [slug]/                  # Dynamic pages
│   ├── page.tsx            # Page implementation
│   └── layout.tsx          # Page layout
└── api/                    # Client-specific API routes
    └── routes/             # API implementations
```

#### **Content Structure** (`content/`)

```
content/
├── pages/                  # Page content
│   ├── home.md             # Home page content
│   ├── about.md            # About page content
│   └── services.md         # Services page content
├── posts/                  # Blog posts
│   ├── post-1.md           # Blog post content
│   └── post-2.md           # Another blog post
├── assets/                 # Media assets
│   ├── images/             # Client images
│   ├── videos/             # Client videos
│   └── documents/          # Client documents
└── data/                   # Structured data
    ├── team.json           # Team member data
    ├── services.json       # Service offerings
    └── testimonials.json    # Customer testimonials
```

#### **Configuration** (`site.config.ts`)

```typescript
export const siteConfig = {
  // Identity
  name: 'Client Name',
  domain: 'client-domain.com',

  // Theme
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter, sans-serif',
  },

  // SEO
  seo: {
    title: 'Client Name - Professional Services',
    description: 'Professional services for businesses',
    keywords: ['services', 'business', 'professional'],
    ogImage: '/images/og-image.jpg',
  },

  // Integrations
  integrations: {
    analytics: 'google-analytics-id',
    crm: 'hubspot-portal-id',
    scheduling: 'calcom-embed-id',
  },

  // Features
  features: {
    booking: true,
    blog: true,
    contact: true,
    newsletter: true,
  },
} satisfies SiteConfig;
```

---

## 🚀 Getting Started

### **Creating a New Client**

```bash
# Create new client with CLI
pnpm create-client client-name

# Interactive client creation
pnpm create-client --interactive

# Create client with specific template
pnpm create-client --template enterprise client-name
```

### **Client Development**

```bash
# Navigate to client directory
cd clients/client-name

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build client
pnpm build

# Test client
pnpm test
```

### **Client Configuration**

```bash
# Validate client configuration
pnpm validate-client clients/client-name

# Check client structure
pnpm validate-client:structure clients/client-name

# Validate client dependencies
pnpm validate-client:deps clients/client-name
```

---

## 🔧 Development Guidelines

### **Client Standards**

- **Configuration**: Type-safe configuration with Zod validation
- **Content**: Markdown-based content with frontmatter
- **Styling**: Tailwind CSS with client theme variables
- **SEO**: Complete SEO optimization with meta tags
- **Performance**: Core Web Vitals compliance

### **Content Management**

- **Markdown**: Use Markdown for all content
- **Frontmatter**: Use YAML frontmatter for metadata
- **Images**: Optimize images for web performance
- **Alt Text**: Include descriptive alt text for accessibility
- **SEO**: Include SEO metadata in content

### **Styling Guidelines**

- **Theme Variables**: Use CSS custom properties for theming
- **Tailwind**: Use Tailwind CSS utility classes
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG 2.2 AA compliance
- **Performance**: Optimize CSS for performance

### **SEO Requirements**

- **Meta Tags**: Complete meta tag implementation
- **Structured Data**: JSON-LD structured data
- **Sitemap**: Auto-generated sitemap
- **Robots.txt**: Proper robots.txt configuration
- **Performance**: Core Web Vitals optimization

---

## 📊 Client Metrics

### **Performance Targets**

- **LCP**: <2.5s (75th percentile)
- **INP**: <200ms (75th percentile)
- **CLS**: <0.1 (75th percentile)
- **FCP**: <1.8s (75th percentile)

### **Quality Metrics**

- **Lighthouse Score**: >90 overall
- **Accessibility**: WCAG 2.2 AA compliance
- **Best Practices**: Modern web standards
- **SEO**: Search engine optimization

### **Business Metrics**

- **Page Views**: Track page view analytics
- **Conversion Rate**: Monitor conversion rates
- **Bounce Rate**: Track bounce rates
- **User Engagement**: Measure user engagement

---

## 🔗 Integration Points

### **Shared Packages**

Clients integrate with shared packages:

```typescript
// UI Components
import { Button, Card, Hero } from '@repo/ui';

// Business Features
import { BookingWidget, ContactForm } from '@repo/features';

// Infrastructure
import { authMiddleware, secureAction } from '@repo/infra';

// Shared Utilities
import { formatDate, validateEmail } from '@repo/shared';
```

### **External Services**

- **Analytics**: Google Analytics, Plausible
- **CRM**: HubSpot, Salesforce
- **Email**: Resend, SendGrid
- **Scheduling**: Cal.com, Acuity
- **Payments**: Stripe, PayPal

---

## 🧪 Testing Strategy

### **Test Types**

- **Unit Tests**: Component and function testing
- **Integration Tests**: API and integration testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: axe-core compliance testing
- **Performance Tests**: Core Web Vitals testing

### **Testing Commands**

```bash
# Run client tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run accessibility tests
pnpm test:a11y

# Run performance tests
pnpm test:performance

# Run Lighthouse tests
pnpm test:lighthouse
```

### **Coverage Requirements**

- **Statements**: >80%
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%

---

## 🚀 Deployment

### **Vercel Deployment**

```bash
# Deploy to Vercel
pnpm deploy

# Deploy preview
pnpm deploy:preview

# Deploy production
pnpm deploy:prod
```

### **Domain Configuration**

```bash
# Add custom domain
vercel domains add client-domain.com

# Verify domain
vercel domains verify client-domain.com

# Check SSL
vercel certs list
```

### **Environment Variables**

```bash
# Client-specific environment variables
NEXT_PUBLIC_CLIENT_NAME="Client Name"
NEXT_PUBLIC_CLIENT_DOMAIN="client-domain.com"
NEXT_PUBLIC_ANALYTICS_ID="analytics-id"
NEXT_PUBLIC_CRM_PORTAL_ID="crm-id"
```

---

## 📚 Documentation

### **Client Documentation**

Each client should include:

- **README.md**: Client overview and setup
- **CHANGELOG.md**: Version history and changes
- **CONTRIBUTING.md**: Contribution guidelines
- **LICENSE.md**: License information

### **Content Documentation**

- **Content Guide**: Content creation guidelines
- **Style Guide**: Writing style guidelines
- **SEO Guide**: SEO optimization guidelines
- **Media Guide**: Media asset guidelines

---

## 🤝 Contributing

### **Client Development**

1. **Create Client**: Use CLI to create new client
2. **Configure**: Set up client configuration
3. **Add Content**: Create client-specific content
4. **Customize**: Add client customizations
5. **Test**: Test client functionality
6. **Deploy**: Deploy client to production

### **Content Updates**

1. **Update Content**: Modify Markdown files
2. **Update Metadata**: Update frontmatter
3. **Update Assets**: Add or update media assets
4. **Validate**: Validate content and configuration
5. **Test**: Test content changes
6. **Deploy**: Deploy content updates

---

## 📞 Support

### **Getting Help**

- **Client Documentation**: Check client-specific README
- **Platform Documentation**: Check platform documentation
- **Issues**: Create GitHub issue with client tag
- **Discussions**: Use GitHub Discussions for questions

### **Troubleshooting**

- **Build Issues**: Check configuration and dependencies
- **Runtime Issues**: Check logs and error messages
- **Performance Issues**: Check Core Web Vitals and bundle analysis
- **Content Issues**: Check content syntax and frontmatter

---

## 📈 Client Management

### **Client Onboarding**

1. **Requirements Gathering**: Collect client requirements
2. **Configuration Setup**: Set up client configuration
3. **Content Creation**: Create initial content
4. **Customization**: Add client customizations
5. **Testing**: Test client functionality
6. **Deployment**: Deploy client to production
7. **Training**: Train client on content management

### **Client Maintenance**

- **Regular Updates**: Keep dependencies updated
- **Security Updates**: Apply security patches
- **Performance Monitoring**: Monitor performance metrics
- **Content Updates**: Update content regularly
- **Backup**: Regular backups of client data

---

_Each client is designed to be independently manageable while sharing common functionality and maintaining consistency across the platform._
