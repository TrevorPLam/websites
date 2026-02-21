'use client';

/**
 * @file packages/marketing-components/src/footer/FooterStandard.tsx
 * @role component
 * @summary Standard multi-column footer
 */

import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { FooterColumn, FooterLink, FooterSocialLink } from './types';

export interface FooterStandardProps {
  columns: FooterColumn[];
  legalLinks?: FooterLink[];
  copyright: string;
  socialLinks?: FooterSocialLink[];
  logo?: React.ReactNode;
  className?: string;
}

/** Replace {year} with current year */
function formatCopyright(template: string): string {
  return template.replace('{year}', String(new Date().getFullYear()));
}

const socialIcons: Record<FooterSocialLink['platform'], string> = {
  facebook: 'f',
  twitter: '𝕏',
  linkedin: 'in',
  instagram: 'ig',
  youtube: '▶',
  tiktok: '♪',
};

export function FooterStandard({
  columns,
  legalLinks = [],
  copyright,
  socialLinks = [],
  logo,
  className,
}: FooterStandardProps) {
  return (
    <footer className={cn('border-t border-border bg-muted/30', className)}>
      <Container>
        <div className="py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {logo && (
              <div className="lg:col-span-1">
                <div className="flex items-center">{logo}</div>
              </div>
            )}
            {columns.map((col, i) => (
              <div key={col.heading + i}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                  {col.heading}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">{formatCopyright(copyright)}</p>
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={link.label ?? link.platform}
                >
                  {socialIcons[link.platform] ?? link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
