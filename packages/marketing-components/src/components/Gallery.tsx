// Gallery components - placeholder implementations
import React from 'react';
import { cn } from '@repo/utils';
import type { GalleryItem } from '../types';

interface ImageGridProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4 | 5;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ items, columns = 3 }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 lg:grid-cols-4',
        'gap-4'
      )}
    >
      {items.map((item) => (
        <div key={item.id} className="relative group overflow-hidden rounded-lg">
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-semibold">{item.title ?? item.alt}</h3>
              {item.description && <p className="text-sm">{item.description}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ImageCarouselProps {
  items: GalleryItem[];
  showThumbnails?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ items, showThumbnails = false }) => {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div className="flex space-x-4">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <img src={item.src} alt={item.alt} className="w-full h-96 object-cover" />
            </div>
          ))}
        </div>
      </div>
      {showThumbnails && (
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {items.map((item) => (
            <img
              key={item.id}
              src={item.src}
              alt={item.alt}
              className="flex-shrink-0 w-20 h-20 object-cover rounded cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
};
