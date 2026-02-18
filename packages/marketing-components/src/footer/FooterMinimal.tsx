/**
 * @file packages/marketing-components/src/footer/FooterMinimal.tsx
 * @role component
 * @summary Minimal single-line footer
 */

import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { FooterLink, FooterSocialLink } from './types';

export interface FooterMinimalProps {
  copyright: string;
  links?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  logo?: React.ReactNode;
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

export function FooterMinimal({
  copyright,
  links = [],
  socialLinks = [],
  logo,
  className,
}: FooterMinimalProps) {
  return (
    <footer className={cn('border-t border-border py-6', className)}>
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-6">
            {logo && logo}
            <p className="text-sm text-muted-foreground">{formatCopyright(copyright)}</p>
          </div>
          <div className="flex items-center gap-6">
            {links.map((link) => (
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
      </Container>
    </footer>
  );
}
