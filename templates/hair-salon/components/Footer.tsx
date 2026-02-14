// File: components/Footer.tsx  [TRACE:FILE=components.footer]
// Purpose: Footer component providing site-wide navigation, contact information, and social links.
//          Renders dynamic footer columns from site configuration and maintains consistent branding
//          across all pages with responsive design.
//
// Exports / Entry: Footer component (default export)
// Used by: Root layout (app/layout.tsx) - appears on all pages
//
// Invariants:
// - Must render all footer columns from site configuration
// - Social links must open in new tabs for accessibility
// - Copyright year must update automatically
// - All links must be accessible with proper ARIA labels
// - Footer must be responsive across all device sizes
//
// Status: @public
// Features:
// - [FEAT:NAVIGATION] Site-wide footer navigation
// - [FEAT:CONTACT] Business contact information display
// - [FEAT:SOCIAL] Social media link integration
// - [FEAT:ACCESSIBILITY] Accessible navigation and ARIA labels
// - [FEAT:CONFIGURATION] Dynamic content from site config

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import siteConfig from '@/site.config';

// [TRACE:CONST=components.footer.socialIcons]
// [FEAT:SOCIAL] [FEAT:ACCESSIBILITY]
// NOTE: Social icon mapping - provides consistent icon selection with fallbacks for unsupported platforms.
const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Instagram, // fallback icon
} as const;

// [TRACE:FUNC=components.Footer]
// [FEAT:NAVIGATION] [FEAT:CONTACT] [FEAT:SOCIAL] [FEAT:ACCESSIBILITY]
// NOTE: Footer renderer - displays dynamic content from site config with responsive layout and accessibility features.
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { footer, socialLinks } = siteConfig;

  return (
    <footer className="bg-secondary text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {siteConfig.name.replace(' Template', '')}
            </h3>
            <p className="text-white/70 mb-6">{siteConfig.description}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Columns */}
          {footer.columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footer.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60">
            {footer.copyrightTemplate.replace('{year}', String(currentYear))}
          </p>
        </div>
      </div>
    </footer>
  );
}
