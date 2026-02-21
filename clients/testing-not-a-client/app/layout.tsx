import type { Metadata } from 'next';
import { ThemeInjector, Toaster } from '@repo/ui';
import siteConfig from '../site.config';
import './globals.css';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: siteConfig.seo.titleTemplate },
  description: siteConfig.seo.defaultDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeInjector theme={siteConfig.theme.colors} preset={siteConfig.theme.preset} />
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:w-auto focus:h-auto focus:p-4 focus:m-0 focus:overflow-visible focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
