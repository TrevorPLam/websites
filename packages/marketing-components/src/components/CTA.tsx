// CTA components - placeholder implementations
import React from 'react';

interface CTAButton {
  text?: string;
  label?: string;
  href: string;
}

interface CTABannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: CTAButton;
  primaryCta?: CTAButton; // alias for adapters
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title,
  subtitle,
  description,
  cta,
  primaryCta,
}) => {
  const button = primaryCta ?? cta;
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-xl mb-8">{subtitle}</p>}
        {description && <p className="text-base mb-6">{description}</p>}
        {button && (
          <a
            href={button.href}
            className="bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100"
          >
            {button.text ?? button.label}
          </a>
        )}
      </div>
    </section>
  );
};

interface CTASplitProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta?: CTAButton;
}

export const CTASplit: React.FC<CTASplitProps> = ({ title, subtitle, description, image, cta }) => {
  return (
    <section className="py-16">
      <div className="flex items-center">
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600 mb-8">{subtitle}</p>}
          {description && <p className="text-base text-gray-600 mb-6">{description}</p>}
          {cta && (
            <a
              href={cta.href}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              {cta.text ?? cta.label}
            </a>
          )}
        </div>
        {image && (
          <div className="w-1/2">
            <img src={image} alt={title} className="w-full h-auto rounded" />
          </div>
        )}
      </div>
    </section>
  );
};

export const CTASection = CTABanner; // Alias for compatibility
