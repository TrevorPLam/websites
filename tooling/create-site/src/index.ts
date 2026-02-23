#!/usr/bin/env node
/**
 * @file tooling/create-site/src/index.ts
 * @summary Interactive CLI for creating new client sites with comprehensive configuration
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────

interface SiteConfig {
  identity: {
    tenantId: string;
    siteName: string;
    legalBusinessName: string;
    tagline?: string;
    domain: {
      primary: string;
      subdomain: string;
      customDomains?: string[];
    };
    contact: {
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    };
  };
  theme: {
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      background: string;
      foreground: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      fontScale: 'tight' | 'normal' | 'relaxed';
    };
    logo: {
      light: string;
      dark: string;
      favicon: string;
      appleTouchIcon?: string;
    };
  };
  businessInfo: {
    type: string;
    category: string;
    description: string;
    yearEstablished?: number;
    hoursOfOperation?: Array<{
      dayOfWeek: string;
      opens: string;
      closes: string;
    }>;
    priceRange?: '$' | '$$' | '$$$' | '$$$$';
    acceptedPaymentMethods?: string[];
    serviceArea?: {
      type: 'City' | 'State' | 'Country' | 'Radius';
      value: string;
    };
  };
  features: {
    enableBlog: boolean;
    enableBooking: boolean;
    enableEcommerce: boolean;
    enableChat: boolean;
    enableForms: {
      contactForm: boolean;
      newsletterSignup: boolean;
      customForms?: string[];
    };
  };
  integrations: {
    analytics: {
      googleAnalytics4: {
        enabled: boolean;
        measurementId?: string;
      };
    };
    email: {
      provider: 'postmark' | 'resend' | 'sendgrid';
      fromAddress: string;
      replyToAddress?: string;
    };
  };
  billing: {
    tier: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled' | 'trial';
  };
  notifications: {
    email: {
      enabled: boolean;
      newLeadNotification: boolean;
      qualifiedLeadNotification: boolean;
      recipients: string[];
    };
  };
  compliance: {
    gdpr: {
      enabled: boolean;
      dataRetentionDays: number;
    };
    wcag: {
      targetLevel: 'A' | 'AA' | 'AAA';
      enableAccessibilityStatement: boolean;
    };
  };
}

interface IndustryConfig {
  type: string;
  category: string;
  tagline: string;
  description: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  acceptedPaymentMethods: string[];
  serviceCategories: string[];
  features: {
    enableBooking: boolean;
    enableEcommerce: boolean;
    enableChat: boolean;
  };
}

// ─── Industry Configurations ─────────────────────────────────────────────────

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  salon: {
    type: 'LocalBusiness',
    category: 'Hair Salon',
    tagline: 'Premium hair & beauty services',
    description:
      'Professional hair styling, coloring, and beauty treatments in a relaxing atmosphere.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Cash'],
    serviceCategories: ['Haircut', 'Color', 'Highlights', 'Styling', 'Treatment'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  restaurant: {
    type: 'Restaurant',
    category: 'Fine Dining Restaurant',
    tagline: 'Fresh flavors, unforgettable moments',
    description:
      'Exceptional dining experience with locally sourced ingredients and innovative cuisine.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'],
    serviceCategories: ['Dinner', 'Brunch', 'Private Event', 'Catering'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  'law-firm': {
    type: 'LegalService',
    category: 'Law Firm',
    tagline: 'Experienced counsel you can trust',
    description:
      'Professional legal services with experienced attorneys dedicated to protecting your interests.',
    priceRange: '$$$$',
    acceptedPaymentMethods: ['Credit Card', 'Check', 'Bank Transfer'],
    serviceCategories: ['Initial Consultation', 'Civil Litigation', 'Corporate Law', 'Family Law'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: false,
    },
  },
  dental: {
    type: 'MedicalBusiness',
    category: 'Dental Clinic',
    tagline: 'Brighter smiles, healthier lives',
    description:
      'Comprehensive dental care using modern technology in a comfortable, patient-friendly environment.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Insurance'],
    serviceCategories: ['Cleaning', 'Whitening', 'Filling', 'Orthodontics', 'Emergency Care'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  medical: {
    type: 'MedicalBusiness',
    category: 'Medical Practice',
    tagline: 'Compassionate care, expert medicine',
    description:
      'Comprehensive healthcare services with experienced medical professionals dedicated to your wellbeing.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Insurance'],
    serviceCategories: ['General Checkup', 'Specialist Referral', 'Preventive Care', 'Urgent Care'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  fitness: {
    type: 'LocalBusiness',
    category: 'Fitness Center',
    tagline: 'Train harder. Live better.',
    description:
      'State-of-the-art fitness facility with personal training, group classes, and wellness programs.',
    priceRange: '$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'],
    serviceCategories: ['Personal Training', 'Group Class', 'Nutrition Coaching', 'Assessment'],
    features: {
      enableBooking: true,
      enableEcommerce: true,
      enableChat: true,
    },
  },
  retail: {
    type: 'Store',
    category: 'Retail Store',
    tagline: 'Quality products, exceptional service',
    description:
      'Curated selection of premium products with outstanding customer service and support.',
    priceRange: '$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'],
    serviceCategories: ['General Inquiry', 'Order Support', 'Returns', 'Wholesale'],
    features: {
      enableBooking: false,
      enableEcommerce: true,
      enableChat: true,
    },
  },
  consulting: {
    type: 'ProfessionalService',
    category: 'Business Consulting',
    tagline: 'Strategy that drives results',
    description:
      'Strategic business consulting helping organizations achieve their goals through expert guidance.',
    priceRange: '$$$$',
    acceptedPaymentMethods: ['Credit Card', 'Bank Transfer', 'Invoice'],
    serviceCategories: ['Strategy', 'Operations', 'Technology', 'Change Management'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: false,
    },
  },
  realestate: {
    type: 'ProfessionalService',
    category: 'Real Estate Agency',
    tagline: 'Find your perfect home',
    description:
      'Professional real estate services helping you buy, sell, or rent properties with expert guidance.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Bank Transfer'],
    serviceCategories: ['Buying', 'Selling', 'Renting', 'Investment Properties'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  construction: {
    type: 'HomeAndConstructionBusiness',
    category: 'Construction Company',
    tagline: 'Built to last, crafted with care',
    description:
      'Professional construction services delivering quality craftsmanship and reliable project management.',
    priceRange: '$$$',
    acceptedPaymentMethods: ['Credit Card', 'Bank Transfer', 'Check'],
    serviceCategories: ['Residential', 'Commercial', 'Renovation', 'Roofing', 'Flooring'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
  automotive: {
    type: 'LocalBusiness',
    category: 'Auto Repair Shop',
    tagline: 'Your trusted auto care partner',
    description:
      'Complete automotive repair and maintenance services with certified technicians and quality parts.',
    priceRange: '$$',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'],
    serviceCategories: ['Oil Change', 'Brake Service', 'Tires', 'Diagnostics', 'Detailing'],
    features: {
      enableBooking: true,
      enableEcommerce: false,
      enableChat: true,
    },
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function log(msg: string): void {
  process.stdout.write(msg + '\n');
}

function warn(msg: string): void {
  process.stderr.write('[create-site] ' + msg + '\n');
}

function success(msg: string): void {
  process.stdout.write('\u001b[32m✅ ' + msg + '\u001b[0m\n');
}

function info(msg: string): void {
  process.stdout.write('\u001b[36mℹ️  ' + msg + '\u001b[0m\n');
}

function question(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

function validateDomain(domain: string): boolean {
  return /^[a-z0-9-]+\.[a-z]{2,}$/.test(domain);
}

function validateHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return phone;
}

// ─── Configuration Generation ───────────────────────────────────────────────

function generateSiteConfig(answers: {
  tenantSlug: string;
  siteName: string;
  legalBusinessName: string;
  tagline: string;
  domain: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  enableBlog: boolean;
  enableNewsletter: boolean;
  googleAnalyticsId?: string;
  emailProvider: 'postmark' | 'resend' | 'sendgrid';
  billingTier: 'starter' | 'professional' | 'enterprise';
  notificationEmails: string[];
}): SiteConfig {
  const industryConfig = INDUSTRY_CONFIGS[answers.industry] || INDUSTRY_CONFIGS.salon;
  const tenantId = randomUUID();

  return {
    identity: {
      tenantId,
      siteName: answers.siteName,
      legalBusinessName: answers.legalBusinessName,
      tagline: answers.tagline || industryConfig.tagline,
      domain: {
        primary: answers.domain,
        subdomain: answers.tenantSlug,
      },
      contact: {
        email: answers.email,
        phone: formatPhone(answers.phone),
        address: {
          street: answers.address.street,
          city: answers.address.city,
          state: answers.address.state,
          zip: answers.address.zip,
          country: 'US',
        },
      },
    },
    theme: {
      colorPalette: {
        primary: answers.primaryColor,
        secondary: answers.secondaryColor,
        accent: answers.accentColor,
        neutral: '#6b7280',
        background: '#ffffff',
        foreground: '#111827',
      },
      typography: {
        headingFont: answers.headingFont,
        bodyFont: answers.bodyFont,
        fontScale: 'normal',
      },
      logo: {
        light: `https://cdn.example.com/${answers.tenantSlug}/logo-light.svg`,
        dark: `https://cdn.example.com/${answers.tenantSlug}/logo-dark.svg`,
        favicon: `https://cdn.example.com/${answers.tenantSlug}/favicon.ico`,
      },
    },
    businessInfo: {
      type: industryConfig.type,
      category: industryConfig.category,
      description: `${answers.siteName} - ${industryConfig.description}`,
      yearEstablished: new Date().getFullYear(),
      hoursOfOperation: [
        { dayOfWeek: 'Monday', opens: '09:00', closes: '17:00' },
        { dayOfWeek: 'Tuesday', opens: '09:00', closes: '17:00' },
        { dayOfWeek: 'Wednesday', opens: '09:00', closes: '17:00' },
        { dayOfWeek: 'Thursday', opens: '09:00', closes: '17:00' },
        { dayOfWeek: 'Friday', opens: '09:00', closes: '17:00' },
      ],
      priceRange: industryConfig.priceRange,
      acceptedPaymentMethods: industryConfig.acceptedPaymentMethods,
      serviceArea: {
        type: 'Radius',
        value: '50 miles',
      },
    },
    features: {
      enableBlog: answers.enableBlog,
      enableBooking: industryConfig.features.enableBooking,
      enableEcommerce: industryConfig.features.enableEcommerce,
      enableChat: industryConfig.features.enableChat,
      enableForms: {
        contactForm: true,
        newsletterSignup: answers.enableNewsletter,
      },
    },
    integrations: {
      analytics: {
        googleAnalytics4: {
          enabled: !!answers.googleAnalyticsId,
          measurementId: answers.googleAnalyticsId,
        },
      },
      email: {
        provider: answers.emailProvider,
        fromAddress: `noreply@${answers.domain}`,
        replyToAddress: answers.email,
      },
    },
    billing: {
      tier: answers.billingTier,
      status: 'trial',
    },
    notifications: {
      email: {
        enabled: true,
        newLeadNotification: true,
        qualifiedLeadNotification: true,
        recipients: answers.notificationEmails,
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
}

// ─── File Operations ───────────────────────────────────────────────────────────

function createSiteDirectory(siteName: string, config: SiteConfig): void {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const sitesDir = path.join(repoRoot, 'sites');
  const siteDir = path.join(sitesDir, siteName);

  if (fs.existsSync(siteDir)) {
    throw new Error(`Site "${siteName}" already exists at ${siteDir}`);
  }

  // Create directory structure
  fs.mkdirSync(siteDir, { recursive: true });
  fs.mkdirSync(path.join(siteDir, 'app'), { recursive: true });
  fs.mkdirSync(path.join(siteDir, 'public'), { recursive: true });

  // Create package.json
  const packageJson = {
    name: `@sites/${siteName}`,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: 'latest',
      react: 'latest',
      'react-dom': 'latest',
      '@repo/config-schema': 'workspace:*',
      '@repo/ui': 'workspace:*',
      '@repo/features': 'workspace:*',
    },
  };

  fs.writeFileSync(path.join(siteDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');

  // Create site.config.ts
  const configContent = `import { validateSiteConfig } from '@repo/config-schema';

const config = ${JSON.stringify(config, null, 2)};

export default validateSiteConfig(config);
`;

  fs.writeFileSync(path.join(siteDir, 'site.config.ts'), configContent);

  // Create basic Next.js app structure
  const layoutContent = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${config.identity.siteName}',
  description: '${config.businessInfo.description}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
`;

  fs.writeFileSync(path.join(siteDir, 'app/layout.tsx'), layoutContent);

  const pageContent = `export default function HomePage() {
  return (
    <div>
      <h1>Welcome to ${config.identity.siteName}</h1>
      <p>${config.businessInfo.description}</p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(siteDir, 'app/page.tsx'), pageContent);

  // Create README.md
  const readmeContent = `# ${config.identity.siteName}

${config.businessInfo.description}

## Development

\`\`\`bash
pnpm dev
\`\`\`

## Build

\`\`\`bash
pnpm build
\`\`\`

## Configuration

See \`site.config.ts\` for site configuration.
`;

  fs.writeFileSync(path.join(siteDir, 'README.md'), readmeContent);
}

// ─── Interactive Prompts ─────────────────────────────────────────────────────

async function collectBasicInfo(): Promise<{
  tenantSlug: string;
  siteName: string;
  legalBusinessName: string;
  tagline: string;
}> {
  log("\n🚀 Let's create your new client site!\n");

  let tenantSlug: string;
  do {
    tenantSlug = await question('Tenant slug (lowercase, alphanumeric + hyphens): ');
    if (!/^[a-z0-9-]+$/.test(tenantSlug)) {
      warn('Invalid format. Use lowercase letters, numbers, and hyphens only.');
    }
  } while (!/^[a-z0-9-]+$/.test(tenantSlug));

  let siteName: string;
  do {
    siteName = await question('Site name (display name): ');
    if (siteName.length === 0) {
      warn('Site name is required.');
    }
  } while (siteName.length === 0);

  let legalBusinessName: string;
  do {
    legalBusinessName = await question('Legal business name: ');
    if (legalBusinessName.length === 0) {
      warn('Legal business name is required.');
    }
  } while (legalBusinessName.length === 0);

  const tagline = await question('Tagline (optional): ');

  return { tenantSlug, siteName, legalBusinessName, tagline };
}

async function collectDomainInfo(): Promise<{
  domain: string;
}> {
  log('\n🌐 Domain Configuration\n');

  let domain: string;
  do {
    domain = await question('Primary domain (e.g., example.com): ');
    if (!validateDomain(domain)) {
      warn('Invalid domain format. Use format: example.com');
    }
  } while (!validateDomain(domain));

  return { domain };
}

async function collectContactInfo(): Promise<{
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}> {
  log('\n📧 Contact Information\n');

  let email: string;
  do {
    email = await question('Contact email: ');
    if (!validateEmail(email)) {
      warn('Invalid email format.');
    }
  } while (!validateEmail(email));

  let phone: string;
  do {
    phone = await question('Contact phone (E.164 format, e.g., +14155552671): ');
    if (!validatePhone(phone)) {
      warn('Invalid phone format. Use E.164 format: +14155552671');
    }
  } while (!validatePhone(phone));

  const street = await question('Street address: ');
  const city = await question('City: ');

  let state: string;
  do {
    state = await question('State (2-letter code): ');
    if (!/^[A-Z]{2}$/.test(state)) {
      warn('Use 2-letter state code (e.g., CA, NY, TX).');
    }
  } while (!/^[A-Z]{2}$/.test(state));

  let zip: string;
  do {
    zip = await question('ZIP code: ');
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      warn('Invalid ZIP format. Use 5-digit or ZIP+4 format.');
    }
  } while (!/^\d{5}(-\d{4})?$/.test(zip));

  return {
    email,
    phone,
    address: { street, city, state, zip },
  };
}

async function selectIndustry(): Promise<string> {
  log('\n🏢 Industry Selection\n');

  const industries = Object.keys(INDUSTRY_CONFIGS);
  industries.forEach((industry, index) => {
    log(`${index + 1}. ${industry.replace('-', ' ')} - ${INDUSTRY_CONFIGS[industry].category}`);
  });

  let selection: string;
  do {
    selection = await question('Select industry (1-' + industries.length + '): ');
    const index = parseInt(selection) - 1;
    if (index < 0 || index >= industries.length) {
      warn('Invalid selection.');
    } else {
      return industries[index];
    }
  } while (true);
}

async function collectThemeInfo(): Promise<{
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
}> {
  log('\n🎨 Theme Customization\n');

  let primaryColor: string;
  do {
    primaryColor = await question('Primary brand color (hex, e.g., #2563eb): ');
    if (!validateHexColor(primaryColor)) {
      warn('Invalid hex color format. Use format: #2563eb');
    }
  } while (!validateHexColor(primaryColor));

  let secondaryColor: string;
  do {
    secondaryColor = await question('Secondary brand color (hex, e.g., #64748b): ');
    if (!validateHexColor(secondaryColor)) {
      warn('Invalid hex color format. Use format: #64748b');
    }
  } while (!validateHexColor(secondaryColor));

  let accentColor: string;
  do {
    accentColor = await question('Accent color (hex, e.g., #f59e0b): ');
    if (!validateHexColor(accentColor)) {
      warn('Invalid hex color format. Use format: #f59e0b');
    }
  } while (!validateHexColor(accentColor));

  const headingFont = (await question('Heading font (default: Inter): ')) || 'Inter';
  const bodyFont = (await question('Body font (default: Inter): ')) || 'Inter';

  return { primaryColor, secondaryColor, accentColor, headingFont, bodyFont };
}

async function collectFeatureInfo(): Promise<{
  enableBlog: boolean;
  enableNewsletter: boolean;
}> {
  log('\n⚡ Feature Configuration\n');

  const enableBlog = (await question('Enable blog? (y/N): ')).toLowerCase() === 'y';
  const enableNewsletter =
    (await question('Enable newsletter signup? (y/N): ')).toLowerCase() === 'y';

  return { enableBlog, enableNewsletter };
}

async function collectIntegrationInfo(): Promise<{
  googleAnalyticsId?: string;
  emailProvider: 'postmark' | 'resend' | 'sendgrid';
}> {
  log('\n🔗 Integration Setup\n');

  const googleAnalyticsId =
    (await question('Google Analytics Measurement ID (optional, e.g., G-XXXXXXXXXX): ')) ||
    undefined;

  let emailProvider: 'postmark' | 'resend' | 'sendgrid' = 'postmark';
  const providerChoice =
    (await question('Email provider (1=Postmark, 2=Resend, 3=SendGrid) [1]: ')) || '1';
  switch (providerChoice) {
    case '2':
      emailProvider = 'resend';
      break;
    case '3':
      emailProvider = 'sendgrid';
      break;
    default:
      emailProvider = 'postmark';
  }

  return { googleAnalyticsId, emailProvider };
}

async function collectBillingInfo(): Promise<{
  billingTier: 'starter' | 'professional' | 'enterprise';
  notificationEmails: string[];
}> {
  log('\n💳 Billing Configuration\n');

  let billingTier: 'starter' | 'professional' | 'enterprise' = 'starter';
  const tierChoice =
    (await question('Billing tier (1=Starter, 2=Professional, 3=Enterprise) [1]: ')) || '1';
  switch (tierChoice) {
    case '2':
      billingTier = 'professional';
      break;
    case '3':
      billingTier = 'enterprise';
      break;
    default:
      billingTier = 'starter';
  }

  const notificationEmailsStr = await question('Notification emails (comma-separated): ');
  const notificationEmails = notificationEmailsStr
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email);

  return { billingTier, notificationEmails };
}

// ─── Main Execution ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    // Collect all information
    const basicInfo = await collectBasicInfo();
    const domainInfo = await collectDomainInfo();
    const contactInfo = await collectContactInfo();
    const industry = await selectIndustry();
    const themeInfo = await collectThemeInfo();
    const featureInfo = await collectFeatureInfo();
    const integrationInfo = await collectIntegrationInfo();
    const billingInfo = await collectBillingInfo();

    // Generate configuration
    const config = generateSiteConfig({
      ...basicInfo,
      ...domainInfo,
      ...contactInfo,
      industry,
      ...themeInfo,
      ...featureInfo,
      ...integrationInfo,
      ...billingInfo,
    });

    // Show summary
    log('\n📋 Site Configuration Summary\n');
    log(`Site Name: ${config.identity.siteName}`);
    log(`Tenant Slug: ${basicInfo.tenantSlug}`);
    log(`Domain: ${config.identity.domain.primary}`);
    log(`Industry: ${industry}`);
    log(`Primary Color: ${config.theme.colorPalette.primary}`);
    log(`Email: ${config.identity.contact.email}`);
    log(`Phone: ${config.identity.contact.phone}`);
    log(
      `Features: Blog=${config.features.enableBlog}, Newsletter=${config.features.enableForms.newsletterSignup}`
    );
    log(`Billing Tier: ${config.billing.tier}`);

    // Confirm creation
    const confirm = await question('\nCreate site? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      log('Aborted.');
      process.exit(0);
    }

    // Create site
    createSiteDirectory(basicInfo.tenantSlug, config);

    // Success
    success(`Site "${basicInfo.tenantSlug}" created successfully!`);
    info(`📁 Location: sites/${basicInfo.tenantSlug}`);
    info(`⚙️  Config: sites/${basicInfo.tenantSlug}/site.config.ts`);
    info(`🚀 Get started: cd sites/${basicInfo.tenantSlug} && pnpm dev`);
    info(`📧 Update your logo URLs in site.config.ts`);
    info(`🔗 Validate: pnpm validate:configs`);
  } catch (error) {
    if (error instanceof Error) {
      warn(`Error: ${error.message}`);
    } else {
      warn('Unknown error occurred');
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
