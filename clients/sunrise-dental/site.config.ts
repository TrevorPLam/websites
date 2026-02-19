// Task: [5.5] Example: medical/dental industry
import type { SiteConfig } from '@repo/types';

const siteConfig: SiteConfig = {
  id: 'sunrise-dental',
  name: 'Sunrise Dental',
  tagline: 'Family dentistry',
  description: 'Sunrise Dental — industry: dental',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3105',
  industry: 'dental',
  features: {
    hero: 'split',
    services: 'grid',
    team: 'grid',
    testimonials: 'carousel',
    pricing: 'cards',
    contact: 'simple',
    gallery: 'grid',
    blog: true,
    booking: true,
    faq: false,
  },
  integrations: {
    analytics: { provider: 'none' },
    crm: { provider: 'none' },
    booking: { provider: 'internal' },
    email: { provider: 'none' },
    chat: { provider: 'none' },
  },
  navLinks: [
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/book', label: 'Book' },
  ],
  socialLinks: [],
  footer: {
    columns: [{ heading: 'Links', links: [{ href: '/about', label: 'About' }] }],
    legalLinks: [],
    copyrightTemplate: '© {year} Sunrise Dental',
  },
  theme: {
    colors: {
      primary: '174 85% 33%',
      'primary-foreground': '0 0% 100%',
      secondary: '220 20% 14%',
      'secondary-foreground': '0 0% 100%',
      accent: '174 85% 93%',
      'accent-foreground': '174 85% 20%',
      background: '220 14% 96%',
      foreground: '220 20% 8%',
      muted: '220 14% 92%',
      'muted-foreground': '220 10% 40%',
      card: '0 0% 100%',
      'card-foreground': '220 20% 8%',
      destructive: '0 72% 38%',
      'destructive-foreground': '0 0% 100%',
      border: '220 14% 88%',
      input: '220 14% 88%',
      ring: '174 85% 33%',
    },
    fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
    borderRadius: 'medium',
    shadows: 'medium',
  },
  contact: { email: 'hello@sunrisedental.com', phone: '' },
  conversionFlow: {
    type: 'booking',
    serviceCategories: ['Checkup', 'Cleaning'],
    timeSlots: [],
    maxAdvanceDays: 30,
  },
  seo: {
    titleTemplate: '%s | Sunrise Dental',
    defaultDescription: 'Family dentistry',
  },
};

export default siteConfig;
