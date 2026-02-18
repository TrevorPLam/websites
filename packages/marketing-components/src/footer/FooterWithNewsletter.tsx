/**
 * @file packages/marketing-components/src/footer/FooterWithNewsletter.tsx
 * @role component
 * @summary Footer with newsletter signup block
 */

'use client';

import { Container } from '@repo/ui';
import { Input } from '@repo/ui';
import { cn } from '@repo/utils';
import { useNewsletter } from './hooks';
import type { FooterColumn, FooterLink, FooterSocialLink } from './types';

export interface FooterWithNewsletterProps {
  columns: FooterColumn[];
  legalLinks?: FooterLink[];
  copyright: string;
  socialLinks?: FooterSocialLink[];
  logo?: React.ReactNode;
  /** Newsletter block heading */
  newsletterTitle?: string;
  /** Newsletter placeholder */
  newsletterPlaceholder?: string;
  /** Newsletter button text */
  newsletterButtonText?: string;
  /** Called when user submits email */
  onNewsletterSubmit?: (email: string) => Promise<void>;
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

export function FooterWithNewsletter({
  columns,
  legalLinks = [],
  copyright,
  socialLinks = [],
  logo,
  newsletterTitle = 'Stay in the loop',
  newsletterPlaceholder = 'Enter your email',
  newsletterButtonText = 'Subscribe',
  onNewsletterSubmit,
  className,
}: FooterWithNewsletterProps) {
  const { email, setEmail, handleSubmit, isSubmitting, status } = useNewsletter();

  return (
    <footer className={cn('border-t border-border bg-muted/30', className)}>
      <Container>
        <div className="py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            {logo && (
              <div>
                <div className="flex items-center">{logo}</div>
              </div>
            )}
            <div className="lg:col-span-2 lg:col-start-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {newsletterTitle}
              </h3>
              <form
                onSubmit={(e) => handleSubmit(e, onNewsletterSubmit)}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="min-w-0 flex-1"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? '...' : newsletterButtonText}
                </button>
              </form>
              {status === 'success' && (
                <p className="mt-2 text-sm text-green-600">Thanks for subscribing!</p>
              )}
              {status === 'error' && (
                <p className="mt-2 text-sm text-destructive">Something went wrong. Try again.</p>
              )}
            </div>
          </div>
          <div className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                  {col.heading}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
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
