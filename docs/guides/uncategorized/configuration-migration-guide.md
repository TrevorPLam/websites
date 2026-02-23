# Configuration Migration Guide

**Purpose:** Migrate existing site configurations to the new schema structure  
**Target:** Legacy `site.config.ts` files without schema compliance  
**Updated:** 2026-02-23

---

## Overview

This guide helps you migrate existing site configurations to the new schema structure. The migration ensures type safety, validation, and compatibility with the 2026 configuration-as-code standards.

---

## Migration Checklist

### Before Migration

- [ ] Backup existing `site.config.ts` files
- [ ] Identify all sites needing migration
- [ ] Test migration on a single site first
- [ ] Schedule migration during low-traffic periods

### During Migration

- [ ] Generate UUID for each site
- [ ] Convert flat structure to nested sections
- [ ] Fix phone number formats (E.164)
- [ ] Add required address information
- [ ] Validate with new schema

### After Migration

- [ ] Run `pnpm validate:configs` to verify
- [ ] Test site functionality
- [ ] Update any hardcoded references
- [ ] Document changes for team

---

## Automated Migration Script

Use the provided migration script to automate the process:

```bash
# Install migration dependencies
pnpm add -D @types/uuid uuid

# Run migration script
pnpm migrate-config <site-name>

# Example
pnpm migrate-config smith-law
```

### Migration Script Usage

```bash
# Dry run (recommended first)
pnpm migrate-config smith-law --dry-run

# Actual migration
pnpm migrate-config smith-law

# Batch migration (all sites)
pnpm migrate-config --all

# Migration with custom industry defaults
pnpm migrate-config smith-law --industry=legal
```

---

## Manual Migration Steps

### Step 1: Backup Current Configuration

```bash
# Create backup
cp sites/smith-law/site.config.ts sites/smith-law/site.config.ts.backup
```

### Step 2: Generate UUID for Tenant ID

```typescript
// Add to your site.config.ts
import { randomUUID } from 'crypto';

const tenantId = randomUUID(); // e.g., '550e8400-e29b-41d4-a716-446655440000'
```

### Step 3: Convert Structure

#### Before (Legacy)

```typescript
export default {
  siteName: 'Smith & Associates Law Firm',
  domain: 'smith-law.com',
  contact: {
    email: 'contact@smith-law.com',
    phone: '(415) 555-2671',
  },
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
  },
  seo: {
    title: 'Smith & Associates | Family Law Attorneys',
    description: 'Experienced family law attorneys in San Francisco',
  },
};
```

#### After (New Schema)

```typescript
import { validateSiteConfig } from '@repo/config-schema';
import { randomUUID } from 'crypto';

const config = {
  identity: {
    tenantId: randomUUID(), // Generate unique UUID
    siteName: 'Smith & Associates Law Firm',
    legalBusinessName: 'Smith & Associates LLC',
    domain: {
      primary: 'smith-law.com',
      subdomain: 'smith-law',
    },
    contact: {
      email: 'contact@smith-law.com',
      phone: '+14155552671', // Fixed E.164 format
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      },
    },
  },
  theme: {
    colorPalette: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#6b7280',
      background: '#ffffff',
      foreground: '#111827',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    logo: {
      light: 'https://cdn.example.com/logo-light.svg',
      dark: 'https://cdn.example.com/logo-dark.svg',
      favicon: 'https://cdn.example.com/favicon.ico',
    },
  },
  businessInfo: {
    type: 'LegalService',
    category: 'Family Law Attorney',
    description:
      'Experienced family law attorneys providing compassionate legal representation for divorce, custody, and adoption cases in the San Francisco Bay Area.',
    yearEstablished: 2010,
    hoursOfOperation: [
      {
        dayOfWeek: 'Monday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        dayOfWeek: 'Tuesday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        dayOfWeek: 'Wednesday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        dayOfWeek: 'Thursday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '17:00',
      },
    ],
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Check'],
    serviceArea: {
      type: 'Radius',
      value: '50 miles',
    },
  },
  seo: {
    title: 'Smith & Associates | Family Law Attorneys San Francisco',
    description:
      'Experienced family law attorneys in San Francisco providing compassionate legal representation for divorce, custody, and adoption cases.',
    structuredData: {
      enableLocalBusiness: true,
      enableBreadcrumbs: true,
    },
  },
  features: {
    enableBlog: false,
    enableBooking: true,
    enableEcommerce: false,
    enableChat: true,
    enableForms: {
      contactForm: true,
      newsletterSignup: false,
    },
  },
  integrations: {
    analytics: {
      googleAnalytics4: {
        enabled: true,
        measurementId: 'G-XXXXXXXXXX',
      },
    },
    email: {
      provider: 'postmark',
      fromAddress: 'noreply@smith-law.com',
      replyToAddress: 'contact@smith-law.com',
    },
  },
  billing: {
    tier: 'professional',
    status: 'active',
  },
  notifications: {
    email: {
      enabled: true,
      newLeadNotification: true,
      qualifiedLeadNotification: true,
      recipients: ['leads@smith-law.com'],
    },
  },
  compliance: {
    gdpr: {
      enabled: true,
      dataRetentionDays: 730,
    },
    wcag: {
      targetLevel: 'AA',
      enableAccessibilityStatement: true,
    },
  },
};

export default validateSiteConfig(config);
```

---

## Field Mapping Reference

### Identity Section

| Legacy Field    | New Field                    | Notes               |
| --------------- | ---------------------------- | ------------------- |
| `siteName`      | `identity.siteName`          | Same value          |
| `domain`        | `identity.domain.primary`    | Wrap in object      |
| `contact.email` | `identity.contact.email`     | Same value          |
| `contact.phone` | `identity.contact.phone`     | Convert to E.164    |
| N/A             | `identity.tenantId`          | Generate UUID       |
| N/A             | `identity.legalBusinessName` | Required field      |
| N/A             | `identity.domain.subdomain`  | Extract from domain |
| N/A             | `identity.contact.address`   | Required object     |

### Theme Section

| Legacy Field     | New Field                       | Notes                 |
| ---------------- | ------------------------------- | --------------------- |
| `primaryColor`   | `theme.colorPalette.primary`    | Same value            |
| `secondaryColor` | `theme.colorPalette.secondary`  | Same value            |
| N/A              | `theme.colorPalette.accent`     | Add accent color      |
| N/A              | `theme.colorPalette.neutral`    | Add neutral color     |
| N/A              | `theme.colorPalette.background` | Add background        |
| N/A              | `theme.colorPalette.foreground` | Add foreground        |
| N/A              | `theme.typography`              | Add typography object |
| N/A              | `theme.logo`                    | Add logo object       |

### SEO Section

| Legacy Field      | New Field            | Notes               |
| ----------------- | -------------------- | ------------------- |
| `seo.title`       | `seo.title`          | Same value          |
| `seo.description` | `seo.description`    | Same value          |
| N/A               | `seo.structuredData` | Add structured data |
| N/A               | `businessInfo`       | Add business info   |

---

## Common Migration Issues

### 1. Phone Number Format

**Problem:** Phone numbers not in E.164 format

```typescript
// ❌ Legacy formats
phone: '(415) 555-2671';
phone: '415-555-2671';
phone: '415.555.2671';

// ✅ E.164 format
phone: '+14155552671';
```

**Solution:** Strip formatting and add country code

```typescript
function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  throw new Error(`Invalid phone number: ${phone}`);
}
```

### 2. Missing Address Information

**Problem:** Address fields missing or incomplete

```typescript
// ❌ Missing required fields
contact: {
  email: 'contact@example.com',
  phone: '+14155552671',
  // Missing address
}

// ✅ Complete address
contact: {
  email: 'contact@example.com',
  phone: '+14155552671',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'US',
  },
}
```

### 3. Color Format Issues

**Problem:** Colors not in hex format

```typescript
// ❌ Invalid formats
primaryColor: 'blue'
primaryColor: 'rgb(37, 99, 235)'
primaryColor: '#2563ebff'

// ✅ Valid hex format
colorPalette: {
  primary: '#2563eb',
}
```

---

## Industry-Specific Templates

### Legal Services

```typescript
businessInfo: {
  type: 'LegalService',
  category: 'Family Law Attorney', // or 'Corporate Lawyer', 'Immigration Attorney'
  description: 'Experienced legal representation for [specific practice areas]',
  yearEstablished: 2010,
  priceRange: '$$$', // Legal services typically premium
}
```

### Restaurants

```typescript
businessInfo: {
  type: 'Restaurant',
  category: 'Italian Restaurant', // or 'Fine Dining', 'Cafe', 'Fast Casual'
  description: 'Authentic [cuisine type] featuring [signature dishes]',
  yearEstablished: 2015,
  priceRange: '$$', // Restaurant pricing varies
  acceptedPaymentMethods: ['Credit Card', 'Cash', 'Digital Wallet'],
}
```

### Medical Practices

```typescript
businessInfo: {
  type: 'MedicalBusiness',
  category: 'Family Medicine', // or 'Dental Clinic', 'Specialist'
  description: 'Comprehensive [medical specialty] services for patients of all ages',
  yearEstablished: 2008,
  acceptedPaymentMethods: ['Credit Card', 'Insurance'],
}
```

### Professional Services

```typescript
businessInfo: {
  type: 'ProfessionalService',
  category: 'Business Consulting', // or 'Marketing Agency', 'IT Services'
  description: 'Professional [service type] helping businesses achieve [goals]',
  yearEstablished: 2012,
  priceRange: '$$$', // Professional services typically premium
}
```

---

## Validation and Testing

### 1. Schema Validation

```bash
# Validate individual site
pnpm --filter @repo/config-schema validate:configs

# Validate all sites
pnpm validate:configs
```

### 2. Type Checking

```bash
# Check TypeScript compilation
pnpm --filter @clients/smith-law type-check
```

### 3. Conflict Detection

```bash
# Check for duplicate tenantIds or domains
pnpm validate:configs
```

### 4. Functional Testing

```bash
# Test site locally
cd clients/smith-law
pnpm dev

# Verify all functionality works
# - Contact forms
# - Navigation
# - SEO metadata
# - Schema markup
```

---

## Rollback Plan

If migration causes issues:

### 1. Quick Rollback

```bash
# Restore backup
cp sites/smith-law/site.config.ts.backup sites/smith-law/site.config.ts

# Restart development server
pnpm dev
```

### 2. Partial Rollback

```typescript
// Keep new structure but revert problematic sections
const config = {
  identity: {
    // Keep new identity section
  },
  theme: {
    // Revert to legacy theme structure temporarily
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
  },
  // ... other sections
};
```

### 3. Gradual Migration

```typescript
// Migrate section by section
const config = {
  identity: newIdentityStructure, // ✅ Migrated
  theme: legacyThemeStructure, // ⏳ Pending
  seo: newSeoStructure, // ✅ Migrated
  businessInfo: legacyBusinessInfo, // ⏳ Pending
};
```

---

## Post-Migration Checklist

### Technical Validation

- [ ] All sites pass `pnpm validate:configs`
- [ ] No TypeScript compilation errors
- [ ] No duplicate tenantIds or domains
- [ ] All required fields present

### Functional Testing

- [ ] Contact forms submit correctly
- [ ] SEO metadata displays properly
- [ ] Schema markup validates
- [ ] Site navigation works
- [ ] Analytics tracking active

### Performance Verification

- [ ] Page load times acceptable
- [ ] Core Web Vitals within thresholds
- [ ] No console errors
- [ ] Mobile responsiveness maintained

### Documentation Updates

- [ ] Update team documentation
- [ ] Record migration changes
- [ ] Update deployment procedures
- [ ] Train team on new structure

---

## Support and Troubleshooting

### Common Questions

**Q: Do I need to migrate all sites at once?**
A: No, migrate incrementally. Start with a pilot site, validate, then continue.

**Q: What if I don't have all required information?**
A: Use reasonable defaults and mark for future updates. The schema allows optional fields.

**Q: Can I keep some legacy fields?**
A: No, the new schema is strict. Use the `customCSS` field for any custom needs.

**Q: How do I handle multiple locations?**
A: Set `enableMultiLocation: true` and populate the `multiLocation` array.

### Getting Help

1. **Check validation errors** - They provide specific guidance
2. **Reference this guide** - For field mappings and examples
3. **Review schema documentation** - In `packages/config-schema/README.md`
4. **Contact development team** - For complex migration scenarios

---

## Migration Timeline

### Phase 1: Preparation (1 day)

- Backup all configurations
- Set up migration tools
- Create migration plan

### Phase 2: Pilot Migration (1-2 days)

- Migrate 1-2 test sites
- Validate and fix issues
- Refine migration process

### Phase 3: Bulk Migration (3-5 days)

- Migrate remaining sites
- Monitor for issues
- Provide support

### Phase 4: Validation (1-2 days)

- Final validation of all sites
- Performance testing
- Documentation updates

**Total Estimated Time:** 1-2 weeks for typical 10-50 site portfolio

---

## Success Metrics

- ✅ 100% of sites pass schema validation
- ✅ Zero TypeScript compilation errors
- ✅ No duplicate tenantIds or domains
- ✅ All contact forms functional
- ✅ SEO metadata properly displayed
- ✅ Core Web Vitals maintained

Following this guide ensures a smooth migration to the new configuration schema with minimal disruption to site functionality.