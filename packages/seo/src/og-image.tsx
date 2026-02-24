import { ImageResponse } from 'next/og';
import type { SiteConfig } from '@repo/types';

type OgInput = {
  config: SiteConfig;
  pathname: string;
};

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export function buildOgImage({ config, pathname }: OgInput): ImageResponse {
  const segments = pathname.replace(/^\/og/, '').split('/').filter(Boolean);
  const pageType = segments[0] ?? 'home';

  let title = config.name;
  let subtitle = config.tagline || config.description;
  let badge = config.industry;

  if (pageType === 'about') {
    title = `About ${config.name}`;
    badge = 'general' as const;
  }

  if (pageType === 'contact') {
    title = `Contact ${config.name}`;
    subtitle = config.contact.phone ?? config.contact.email;
    badge = config.contact.address?.city ? ('general' as const) : ('general' as const);
  }

  const primaryColor = `hsl(${config.theme.colors.primary ?? '174 100% 26%'})`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '56px 60px',
        borderTop: `8px solid ${primaryColor}`,
      }}
    >
      <div style={{ color: primaryColor, fontSize: 20, fontWeight: 700 }}>
        {truncate(badge, 40)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#111827' }}>{truncate(title, 60)}</div>
        <div style={{ fontSize: 24, color: '#6b7280' }}>{truncate(subtitle, 120)}</div>
      </div>
      <div style={{ fontSize: 22, color: '#374151', fontWeight: 600 }}>{config.name}</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
