// Testimonials components - placeholder implementations
import React from 'react';
import { cn } from '@repo/utils';
import type { Testimonial } from '../types';

interface TestimonialGridProps {
  testimonials: Testimonial[];
  columns?: 2 | 3 | 4;
  title?: string;
}

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  testimonials,
  columns = 3,
  title,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 lg:grid-cols-4',
        'gap-6'
      )}
    >
      {title && <h2 className="text-2xl font-semibold col-span-full">{title}</h2>}
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-600">{testimonial.role}</p>
            {testimonial.company && <p className="text-sm text-gray-500">{testimonial.company}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  title?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  title,
}) => {
  return (
    <div className="relative overflow-hidden">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div className="flex space-x-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex-shrink-0 w-96 bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
              {testimonial.company && (
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
  title?: string;
}

export const TestimonialMarquee: React.FC<TestimonialMarqueeProps> = ({ testimonials, title }) => {
  return (
    <div className="overflow-hidden bg-gray-50 py-4">
      {title && <h2 className="text-2xl font-semibold mb-4 px-4">{title}</h2>}
      <div className="flex space-x-8 animate-marquee">
        {[...testimonials, ...testimonials].map((testimonial, idx) => (
          <div key={`${testimonial.id}-${idx}`} className="flex-shrink-0 w-80">
            <p className="text-gray-700 italic">"{testimonial.content}"</p>
            <p className="text-sm font-semibold mt-2">
              - {testimonial.name}, {testimonial.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
