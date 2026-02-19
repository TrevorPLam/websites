// Industry-specific components - placeholder implementations
import React from 'react';

// Location components
interface LocationListProps {
  locations: Array<{
    id: string;
    name: string;
    address: string;
    phone?: string;
    hours?: string;
  }>;
}

export const LocationList: React.FC<LocationListProps> = ({ locations }) => {
  return (
    <div className="space-y-4">
      {locations.map((location) => (
        <div key={location.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold">{location.name}</h3>
          <p className="text-gray-600">{location.address}</p>
          {location.phone && <p className="text-gray-600">{location.phone}</p>}
          {location.hours && <p className="text-sm text-gray-500">{location.hours}</p>}
        </div>
      ))}
    </div>
  );
};

// Menu components
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category?: string;
}

interface MenuListProps {
  items: MenuItem[];
}

export const MenuList: React.FC<MenuListProps> = ({ items }) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-start bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
          <span className="font-semibold text-blue-600">{item.price}</span>
        </div>
      ))}
    </div>
  );
};

// Portfolio components
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  columns?: 2 | 3 | 4;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <span className="text-sm text-blue-600">{item.category}</span>
            <h3 className="font-semibold mt-2">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Course components
interface CourseItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface CourseGridProps {
  courses: CourseItem[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
          <span className="text-sm text-blue-600 capitalize">{course.level}</span>
          <h3 className="font-semibold mt-2">{course.title}</h3>
          <p className="text-gray-600 mt-2">{course.description}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
            <p className="text-sm text-gray-500">Duration: {course.duration}</p>
            <p className="font-semibold text-blue-600">{course.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Resource components
interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'tool';
  url?: string;
  downloadUrl?: string;
}

interface ResourceGridProps {
  resources: ResourceItem[];
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({ resources }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div key={resource.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">
              {resource.type === 'document' && '📄'}
              {resource.type === 'video' && '🎥'}
              {resource.type === 'link' && '🔗'}
              {resource.type === 'tool' && '🛠️'}
            </span>
            <span className="text-sm text-blue-600 capitalize">{resource.type}</span>
          </div>
          <h3 className="font-semibold">{resource.title}</h3>
          <p className="text-gray-600 mt-2">{resource.description}</p>
          {(resource.url || resource.downloadUrl) && (
            <a
              href={resource.url || resource.downloadUrl}
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              {resource.type === 'document' ? 'Download' : 'Access'} →
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

// Additional placeholder components for other industry-specific needs
export const ComparisonTable: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">Feature</th>
          {items.map((item, idx) => (
            <th key={idx} className="border p-2">{item.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Placeholder comparison rows */}
      </tbody>
    </table>
  </div>
);

export const FilterBar: React.FC<{ filters: string[] }> = ({ filters }) => (
  <div className="flex space-x-2 mb-6">
    {filters.map((filter) => (
      <button key={filter} className="px-4 py-2 border rounded hover:bg-gray-50">
        {filter}
      </button>
    ))}
  </div>
);

export const SearchBar: React.FC<{ placeholder?: string }> = ({ placeholder = 'Search...' }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

export const SocialProofStack: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="space-y-4">
    {items.map((item, idx) => (
      <div key={idx} className="bg-gray-50 p-4 rounded">
        <p className="text-gray-700 italic">"{item.quote}"</p>
        <p className="text-sm text-gray-500 mt-2">- {item.author}</p>
      </div>
    ))}
  </div>
);

export const VideoEmbed: React.FC<{ url: string; title?: string }> = ({ url, title }) => (
  <div className="aspect-w-16 aspect-h-9">
    <iframe
      src={url}
      title={title}
      className="w-full h-full rounded"
      allowFullScreen
    />
  </div>
);

export const AudioPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => (
  <audio controls className="w-full">
    <source src={url} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
);

export const AccordionContent: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="space-y-2">
    {items.map((item, idx) => (
      <details key={idx} className="border rounded">
        <summary className="p-4 cursor-pointer">{item.title}</summary>
        <div className="p-4 pt-0">{item.content}</div>
      </details>
    ))}
  </div>
);

export const WidgetCard: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {content}
  </div>
);
