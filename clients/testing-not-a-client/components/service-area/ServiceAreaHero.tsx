interface ServiceAreaHeroProps {
  city: string;
  state?: string;
  businessName: string;
  industry: string;
  tagline?: string;
  phone?: string;
}

export function ServiceAreaHero({
  city,
  state,
  businessName,
  industry,
  tagline,
  phone,
}: ServiceAreaHeroProps) {
  const industryLabel = industry.charAt(0).toUpperCase() + industry.slice(1);

  return (
    <section
      className="rounded-2xl border border-border bg-card p-8 md:p-12"
      aria-labelledby="service-area-heading"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
        Serving {city}
        {state ? `, ${state}` : ''}
      </p>
      <h1 id="service-area-heading" className="text-3xl font-bold text-foreground md:text-5xl">
        {industryLabel} Services in {city}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        {tagline ?? `${businessName} provides reliable ${industry} services throughout ${city}.`}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Call {phone}
          </a>
        ) : null}
        <a
          href="/contact"
          className="rounded-lg border border-primary px-5 py-3 font-semibold text-primary"
        >
          Get a Free Estimate
        </a>
      </div>
    </section>
  );
}
