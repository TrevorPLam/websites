// Services components - placeholder implementations
import React from 'react';

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

interface ServiceGridProps {
  services: Service[];
  columns?: 2 | 3 | 4;
  title?: string;
  description?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  columns = 3,
  title,
  description,
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {title && <h2 className="text-2xl font-semibold col-span-full">{title}</h2>}
      {description && <p className="text-gray-600 col-span-full">{description}</p>}
      {services.map((service) => (
        <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm">
          {service.icon && <div className="text-2xl mb-4">{service.icon}</div>}
          <h3 className="font-semibold mb-2">{service.name}</h3>
          {service.description && <p className="text-gray-600">{service.description}</p>}
        </div>
      ))}
    </div>
  );
};

interface ServiceListProps {
  services: Service[];
  title?: string;
  description?: string;
}

export const ServiceList: React.FC<ServiceListProps> = ({ services, title, description }) => {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {description && <p className="text-gray-600">{description}</p>}
      {services.map((service) => (
        <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          {service.icon && <div className="text-2xl mr-4">{service.icon}</div>}
          <div>
            <h3 className="font-semibold">{service.name}</h3>
            {service.description && <p className="text-gray-600">{service.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ServiceTabsProps {
  services: Service[];
  categories?: string[];
  title?: string;
}

export const ServiceTabs: React.FC<ServiceTabsProps> = ({ services, categories, title }) => {
  const uniqueCategories = categories || [
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  return (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div className="flex space-x-4 mb-6">
        {uniqueCategories.map((category) => (
          <button key={category} className="px-4 py-2 border-b-2 border-blue-500 text-blue-600">
            {category}
          </button>
        ))}
      </div>
      <ServiceGrid services={services} />
    </div>
  );
};

interface ServiceAccordionProps {
  services: Service[];
  title?: string;
}

export const ServiceAccordion: React.FC<ServiceAccordionProps> = ({ services, title }) => {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {services.map((service) => (
        <details key={service.id} className="bg-white rounded-lg shadow-sm">
          <summary className="p-6 cursor-pointer font-semibold">{service.name}</summary>
          <div className="px-6 pb-6">
            {service.description && <p className="text-gray-600">{service.description}</p>}
          </div>
        </details>
      ))}
    </div>
  );
};
