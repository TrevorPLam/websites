import type { Metadata } from 'next';
import { ThemeInjector } from '@repo/ui';
import siteConfig from '@/site.config';
import './globals.css';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: siteConfig.seo.titleTemplate },
  description: siteConfig.seo.defaultDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeInjector theme={siteConfig.theme.colors} />
        {children}
      </body>
    </html>
  );
}
