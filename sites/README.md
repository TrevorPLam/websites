# 🌐 Sites

> **Site configurations and templates for the marketing websites platform**

This directory contains site configurations, templates, and shared resources for client websites. It provides a centralized location for site-wide configurations, templates, and reusable site components.

---

## 📁 Site Structure

```
sites/
├── [base-app]/              # Base application template
│   ├── src/                 # Source code
│   ├── README.md            # Template documentation
│   └── package.json         # Template dependencies
└── [site-configurations]/   # Site-specific configurations
    ├── site-1/              # Site 1 configuration
    ├── site-2/              # Site 2 configuration
    └── templates/           # Configuration templates
```

---

## 🎯 Site Overview

### **Base Application** (`sites/[base-app]/`)

**Purpose**: Base template and reference implementation

**Key Features**:

- Complete site structure template
- Feature-Sliced Design implementation
- Performance optimization examples
- Accessibility compliance patterns
- SEO optimization templates

**Technology Stack**:

- Next.js 16 with App Router
- React 19 Server Components
- TypeScript strict mode
- Tailwind CSS v4
- Multi-tenant ready

**Usage**: Reference implementation for new sites

---

### **Site Configurations**

**Purpose**: Site-specific configurations and templates

**Configuration Types**:

- **Theme Configurations**: Color schemes, typography, branding
- **Feature Configurations**: Enabled features and integrations
- **SEO Configurations**: Meta tags, structured data, sitemaps
- **Performance Configurations**: Caching, optimization, monitoring

---

## 🚀 Getting Started

### **Using Base Template**

```bash
# Copy base template to new site
cp -r sites/[base-app] sites/new-site

# Navigate to new site
cd sites/new-site

# Customize configuration
cp site.config.example.ts site.config.ts

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### **Creating Site Configuration**

```bash
# Create new site configuration
mkdir sites/configurations/new-site

# Copy configuration template
cp sites/templates/site-config.template.ts sites/configurations/new-site/site.config.ts

# Customize configuration
# Edit sites/configurations/new-site/site.config.ts
```

---

## 🔧 Configuration Management

### **Site Configuration Structure**

```typescript
// sites/configurations/site-name/site.config.ts
export const siteConfig = {
  // Identity
  identity: {
    name: 'Site Name',
    domain: 'site-domain.com',
    description: 'Site description',
  },

  // Theme
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter, sans-serif',
    brandColors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
  },

  // Features
  features: {
    booking: true,
    blog: true,
    contact: true,
    newsletter: true,
    analytics: true,
  },

  // Integrations
  integrations: {
    analytics: 'google-analytics-id',
    crm: 'hubspot-portal-id',
    scheduling: 'calcom-embed-id',
    email: 'resend-api-key',
  },

  // SEO
  seo: {
    title: 'Site Name - Professional Services',
    description: 'Professional services description',
    keywords: ['services', 'business', 'professional'],
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
  },

  // Performance
  performance: {
    enableCaching: true,
    enableOptimization: true,
    enableMonitoring: true,
    bundleOptimization: true,
  },
} satisfies SiteConfig;
```

### **Configuration Validation**

```bash
# Validate site configuration
pnpm validate-site-config sites/configurations/site-name/site.config.ts

# Validate all site configurations
pnpm validate-all-site-configs

# Check configuration conflicts
pnpm check-config-conflicts
```

---

## 🎨 Theme Management

### **Theme Variables**

```css
/* sites/configurations/site-name/theme.css */
:root {
  /* Brand Colors */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;

  /* Typography */
  --font-family-primary: 'Inter', sans-serif;
  --font-family-secondary: 'Georgia', serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### **Theme Customization**

```typescript
// sites/configurations/site-name/theme.config.ts
export const themeConfig = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    neutral: {
      50: '#f9fafb',
      500: '#6b7280',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};
```

---

## 📊 Site Templates

### **Template Types**

- **Basic Template**: Simple site with basic features
- **Professional Template**: Professional services site
- **E-commerce Template**: E-commerce functionality
- **Blog Template**: Blog-focused site
- **Portfolio Template**: Portfolio and gallery site

### **Template Usage**

```bash
# Create site from template
pnpm create-site --template professional site-name

# List available templates
pnpm list-templates

# Preview template
pnpm preview-template professional
```

---

## 🔗 Integration Points

### **Shared Components**

Sites integrate with shared packages:

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

### **Site-Specific Components**

```typescript
// sites/configurations/site-name/components/
import { SiteHeader, SiteFooter } from './components/layout';
import { SiteHero, SiteFeatures } from './components/sections';
import { SiteTestimonials, SiteContact } from './components/content';
```

---

## 🧪 Testing Strategy

### **Test Types**

- **Configuration Tests**: Configuration validation
- **Theme Tests**: Theme application and consistency
- **Integration Tests**: Site integration testing
- **Performance Tests**: Site performance testing
- **Accessibility Tests**: WCAG 2.2 AA compliance

### **Testing Commands**

```bash
# Test site configuration
pnpm test:site-config

# Test theme application
pnpm test:theme

# Test site integration
pnpm test:site-integration

# Test site performance
pnpm test:site-performance

# Test site accessibility
pnpm test:site-a11y
```

---

## 🚀 Deployment

### **Site Deployment**

```bash
# Build site
pnpm build

# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production

# Deploy preview
pnpm deploy:preview
```

### **Environment Configuration**

```bash
# Site-specific environment variables
NEXT_PUBLIC_SITE_NAME="Site Name"
NEXT_PUBLIC_SITE_DOMAIN="site-domain.com"
NEXT_PUBLIC_SITE_CONFIG="/sites/configurations/site-name/site.config.ts"
```

---

## 📚 Documentation

### **Site Documentation**

Each site should include:

- **README.md**: Site overview and setup
- **CHANGELOG.md**: Version history and changes
- **CONFIGURATION.md**: Configuration guide
- **THEME.md**: Theme customization guide

### **Template Documentation**

- **Template Guide**: Template usage guide
- **Customization Guide**: Template customization
- **Best Practices**: Site development best practices
- **Troubleshooting**: Common issues and solutions

---

## 🤝 Contributing

### **Site Development**

1. **Choose Template**: Select appropriate template
2. **Configure Site**: Set up site configuration
3. **Customize Theme**: Apply site-specific theming
4. **Add Content**: Create site-specific content
5. **Test Site**: Test site functionality
6. **Deploy Site**: Deploy site to production

### **Template Development**

1. **Create Template**: Create new site template
2. **Document Template**: Document template usage
3. **Test Template**: Test template functionality
4. **Validate Template**: Validate template compliance
5. **Submit Template**: Submit template for review

---

## 📞 Support

### **Getting Help**

- **Site Documentation**: Check site-specific documentation
- **Template Documentation**: Check template guides
- **Issues**: Create GitHub issue with site tag
- **Discussions**: Use GitHub Discussions for questions

### **Troubleshooting**

- **Configuration Issues**: Check configuration syntax and validation
- **Theme Issues**: Check theme variables and application
- **Integration Issues**: Check package dependencies and imports
- **Performance Issues**: Check Core Web Vitals and optimization

---

## 📈 Site Management

### **Site Onboarding**

1. **Requirements Gathering**: Collect site requirements
2. **Template Selection**: Choose appropriate template
3. **Configuration Setup**: Set up site configuration
4. **Theme Customization**: Apply site-specific theming
5. **Content Creation**: Create initial content
6. **Testing**: Test site functionality
7. **Deployment**: Deploy site to production
8. **Training**: Train site administrators

### **Site Maintenance**

- **Regular Updates**: Keep dependencies updated
- **Security Updates**: Apply security patches
- **Performance Monitoring**: Monitor performance metrics
- **Content Updates**: Update content regularly
- **Backup**: Regular backups of site data

---

_Sites provide a flexible and scalable way to manage multiple client websites while maintaining consistency and reusability across the platform._
