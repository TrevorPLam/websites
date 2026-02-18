// File: packages/marketing-components/src/hero/HeroCentered.tsx
// Purpose: Full-width centered hero section
// Task: 2.1
// Status: Scaffolded - TODO: Implement

export interface HeroCenteredProps {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function HeroCentered({ title, subtitle, cta, className }: HeroCenteredProps) {
  // TODO: Implement centered hero layout
  return (
    <section className={className}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {cta && <a href={cta.href}>{cta.label}</a>}
    </section>
  );
}
