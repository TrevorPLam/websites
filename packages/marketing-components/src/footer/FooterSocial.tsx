'use client';

/**
 * @file packages/marketing-components/src/footer/FooterSocial.tsx
 * @role component
 * @summary Social-focused footer
 */

import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { FooterLink, FooterSocialLink } from './types';

export interface FooterSocialProps {
  copyright: string;
  socialLinks: FooterSocialLink[];
  links?: FooterLink[];
  logo?: React.ReactNode;
  tagline?: string;
  className?: string;
}

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

export function FooterSocial({
  copyright,
  socialLinks,
  links = [],
  logo,
  tagline,
  className,
}: FooterSocialProps) {
  return (
    <footer className={cn('border-t border-border bg-muted/30', className)}>
      <Container>
        <div className="py-12">
          <div className="flex flex-col items-center text-center">
            {logo && <div className="mb-4">{logo}</div>}
            {tagline && <p className="mb-6 text-muted-foreground">{tagline}</p>}
            <div className="mb-8 flex flex-wrap justify-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={link.label ?? link.platform}
                >
                  <span className="text-lg">{socialIcons[link.platform] ?? link.platform}</span>
                </a>
              ))}
            </div>
            {links.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-6">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">{formatCopyright(copyright)}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
