/**
 * @file apps/web/src/widgets/testimonial-carousel/ui/TestimonialsCarousel.tsx
 * @summary Testimonials carousel component.
 * @description Carousel of customer testimonials showing social proof.
 * @security No sensitive data handling; UI component only.
 * @adr none
 * @requirements DOMAIN-3-6
 */

/**
 * Renders a carousel of customer testimonials showing social proof.
 *
 * @returns JSX element representing the testimonials carousel component.
 */
export function TestimonialsCarousel() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechStart Inc.',
      content:
        'This platform has transformed how we manage our marketing websites. The multi-tenant architecture is perfect for our portfolio of brands.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'Growth Labs',
      content:
        "We've tried many website builders, but nothing compares to the flexibility and power of this platform. Our lead conversion rates have doubled.",
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'Creative Studio',
      content:
        "The SEO features alone are worth the investment. We're ranking on page 1 for multiple competitive keywords.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ★
                  </span>
                ))}
              </div>

              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
