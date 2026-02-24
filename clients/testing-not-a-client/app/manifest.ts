import type { MetadataRoute } from 'next';
import siteConfig from '../site.config';

export default function manifest(): MetadataRoute.Manifest {
  const siteName = siteConfig.identity?.siteName ?? 'Business Site';
  const primaryColor = siteConfig.theme?.colors?.primary ?? '#2563eb';

  return {
    name: siteName,
    short_name: siteName.slice(0, 12),
    description: siteConfig.identity?.tagline,
    theme_color: primaryColor,
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/?source=pwa',
    scope: '/',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcuts: [
      {
        name: 'Contact Us',
        short_name: 'Contact',
        url: '/contact?source=pwa-shortcut',
        icons: [{ src: '/icon-contact.png', sizes: '96x96' }],
      },
    ],
  };
}
