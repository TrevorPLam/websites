// File: packages/marketing-components/src/services/ServiceGrid.tsx
// Purpose: Service card grid layout (2/3/4 columns)
// Task: 2.2
// Status: Scaffolded - TODO: Implement

import * as React from 'react';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  image?: {
    src: string;
    alt: string;
  };
}

export interface ServiceGridProps {
  services: Service[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ServiceGrid({ services, columns = 3, className }: ServiceGridProps) {
  // TODO: Implement responsive grid layout
  return (
    <div className={className}>
      {services.map((service) => (
        <div key={service.id}>
          {service.image && <img src={service.image.src} alt={service.image.alt} />}
          <h3>{service.name}</h3>
          {service.description && <p>{service.description}</p>}
          {service.price && <span>{service.price}</span>}
        </div>
      ))}
    </div>
  );
}
