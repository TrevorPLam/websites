// File: packages/marketing-components/src/hero/HeroSplit.tsx
// Purpose: Split hero with image left / content right
// Task: 2.1
// Status: Scaffolded - TODO: Implement

export interface HeroSplitProps {
  title: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function HeroSplit({ title, subtitle, image, cta, className }: HeroSplitProps) {
  // TODO: Implement split hero layout
  return (
    <section className={className}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {cta && <a href={cta.href}>{cta.label}</a>}
      </div>
      {image && <img src={image.src} alt={image.alt} />}
    </section>
  );
}
