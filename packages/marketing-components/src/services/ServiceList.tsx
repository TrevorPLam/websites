// File: packages/marketing-components/src/services/ServiceList.tsx
// Purpose: Detailed vertical service list
// Task: 2.2
// Status: Scaffolded - TODO: Implement

import type { Service } from './types';

export interface ServiceListProps {
  services: Service[];
  className?: string;
}

export function ServiceList({ services, className }: ServiceListProps) {
  // TODO: Implement detailed list layout
  return (
    <ul className={className}>
      {services.map((service) => (
        <li key={service.id}>
          <h3>{service.name}</h3>
          {service.description && <p>{service.description}</p>}
          {service.price && <span>{service.price}</span>}
        </li>
      ))}
    </ul>
  );
}
