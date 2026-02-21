// Hero components - placeholder implementations
import React from 'react';
import Image from 'next/image';

interface CTAProps {
  text?: string;
  label?: string;
  href: string;
}

interface HeroCenteredProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: CTAProps;
}

export const HeroCentered: React.FC<HeroCenteredProps> = ({
  title,
  subtitle,
  description,
  cta,
}) => {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600 mb-8">{subtitle}</p>}
      {description && <p className="text-base text-gray-600 mb-6">{description}</p>}
      {cta && (
        <a href={cta.href} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          {cta.text ?? cta.label}
        </a>
      )}
    </section>
  );
};

interface HeroSplitProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta?: CTAProps;
}

export const HeroSplit: React.FC<HeroSplitProps> = ({
  title,
  subtitle,
  description,
  image,
  cta,
}) => {
  return (
    <section className="flex items-center py-20">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-600 mb-8">{subtitle}</p>}
        {description && <p className="text-base text-gray-600 mb-6">{description}</p>}
        {cta && (
          <a href={cta.href} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            {cta.text ?? cta.label}
          </a>
        )}
      </div>
      {image && (
        <div className="w-1/2 relative aspect-[4/3]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
    </section>
  );
};

interface HeroVideoProps {
  title: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  cta?: CTAProps;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  title,
  subtitle,
  description,
  videoUrl,
  cta,
}) => {
  return (
    <section className="relative py-20">
      {videoUrl && (
        <div className="absolute inset-0">
          <video src={videoUrl} autoPlay muted loop className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}
      <div className="relative text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl mb-8">{subtitle}</p>}
        {description && <p className="text-base mb-6">{description}</p>}
        {cta && (
          <a href={cta.href} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            {cta.text ?? cta.label}
          </a>
        )}
      </div>
    </section>
  );
};

interface HeroCarouselProps {
  slides: Array<{
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    cta?: CTAProps;
  }>;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="flex space-x-4">
        {slides.map((slide, idx) => (
          <div key={idx} className="flex-shrink-0 w-full text-center">
            <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
            {slide.subtitle && <p className="text-xl text-gray-600 mb-8">{slide.subtitle}</p>}
            {slide.description && (
              <p className="text-base text-gray-600 mb-6">{slide.description}</p>
            )}
            {slide.cta && (
              <a
                href={slide.cta.href}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                {slide.cta.text ?? slide.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
