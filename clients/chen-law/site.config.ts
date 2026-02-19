// Task: [5.4] Example: law firm industry
import type { SiteConfig } from '@repo/types';

const siteConfig: SiteConfig = {
  id: 'chen-law',
  name: 'Chen Law',
  tagline: 'Legal excellence',
  description: 'Chen Law — industry: law-firm',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3104',
  industry: 'law-firm',
  features: {
    hero: 'split',
    services: 'grid',
    team: 'detailed',
    testimonials: 'carousel',
    pricing: 'cards',
    contact: 'simple',
    gallery: 'grid',
    blog: true,
    booking: false,
    faq: false,
  },
  integrations: {
    analytics: { provider: 'none' },
    crm: { provider: 'none' },
    booking: { provider: 'none' },
    email: { provider: 'none' },
    chat: { provider: 'none' },
  },
  navLinks: [
    { href: '/services', label: 'Practice Areas' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  socialLinks: [],
  footer: {
    columns: [{ heading: 'Links', links: [{ href: '/about', label: 'About' }] }],
    legalLinks: [],
    copyrightTemplate: '© {year} Chen Law',
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
  contact: { email: 'contact@chenlaw.com', phone: '' },
  conversionFlow: {
    type: 'contact',
  },
  seo: {
    titleTemplate: '%s | Chen Law',
    defaultDescription: 'Legal excellence',
  },
};

export default siteConfig;
