

// [Task 8.2.7] React.memo removed — has no effect on Server Components
import React from 'react';
import { Container, Section, Card } from '@repo/ui';

const testimonials = [
  {
    quote:
      "I've never walked out of a salon feeling this confident. The stylists really listen to what you want.",
    author: 'Sarah Johnson',
    company: 'Local Resident',
    title: 'Client since 2023',
  },
  {
    quote:
      "The atmosphere is so relaxing and the color services are top-notch. I wouldn't trust anyone else with my hair.",
    author: 'Michael Chen',
    company: 'Regular Customer',
    title: 'Client since 2021',
  },
  {
    quote:
      'Fantastic experience from start to finish. The team is professional, friendly, and incredibly talented.',
    author: 'Emily Rodriguez',
    company: 'Wedding Client',
    title: 'Client since 2024',
  },
];

const metrics = [
  { value: '5k+', label: 'Happy Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '4.9', label: 'Average Rating' },
];

function SocialProof() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by our clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why we are the top-rated salon in the area.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} variant="testimonial">
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-muted-foreground text-sm">{testimonial.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-8 text-center">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="text-muted-foreground font-medium">{metric.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default SocialProof;
