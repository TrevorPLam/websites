import React from 'react';
import { Heading } from '@repo/ui/components/heading';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Image } from '@repo/ui/components/image';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Select } from '@repo/ui/components/select';
import { Badge } from '@repo/ui/components/badge';
import { Link } from '@repo/ui/components/link';
import { Container } from '@repo/ui/components/container';
import { Section } from '@repo/ui/components/section';
import { Grid } from '@repo/ui/components/grid';

// Component registry for Puck editor
// Maps component names to React components
export const componentRegistry = {
  // Text components
  heading: {
    component: Heading,
    defaultProps: {
      level: 'h2',
      className: 'text-2xl font-bold',
    },
    category: 'text',
    icon: 'Type',
  },
  paragraph: {
    component: ({ children, ...props }: any) => (
      <p className="text-gray-600 mb-4" {...props}>{children}</p>
    ),
    category: 'text',
    icon: 'Type',
  },
  text: {
    component: ({ children, ...props }: any) => (
      <span className="text-gray-600" {...props}>{children}</span>
    ),
    category: 'text',
    icon: 'Type',
  },
  
  // Form components
  input: {
    component: Input,
    defaultProps: {
      type: 'text',
      placeholder: 'Enter text...',
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md',
    },
    category: 'form',
    icon: 'Input',
  },
  textarea: {
    component: Textarea,
    defaultProps: {
      placeholder: 'Enter text...',
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md',
      rows: 4,
    },
    category: 'form',
    icon: 'Textarea',
  },
  select: {
    component: Select,
    defaultProps: {
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md',
    },
    category: 'form',
    icon: 'Select',
  },
  
  // Action components
  button: {
    component: Button,
    defaultProps: {
      variant: 'primary',
      size: 'md',
      className: 'px-4 py-2',
    },
    category: 'action',
    icon: 'MousePointer',
  },
  link: {
    component: Link,
    defaultProps: {
      className: 'text-blue-600 hover:text-blue-800',
    },
    category: 'action',
    icon: 'Link',
  },
  
  // Layout components
  container: {
    component: Container,
    category: 'layout',
    icon: 'Layout',
  },
  section: {
    component: Section,
    category: 'layout',
    icon: 'Layout',
  },
  grid: {
    component: Grid,
    defaultProps: {
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    },
    category: 'layout',
    icon: 'Grid',
  },
  
  // Media components
  image: {
    component: Image,
    defaultProps: {
      alt: 'Image',
      className: 'w-full h-auto object-cover rounded-md',
    },
    category: 'media',
    icon: 'Image',
  },
  card: {
    component: Card,
    defaultProps: {
      className: 'p-6 border border-gray-200 rounded-lg shadow-sm',
    },
    category: 'layout',
    icon: 'Card',
  },
  
  // Badge components
  badge: {
    component: Badge,
    defaultProps: {
      variant: 'default',
      className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    },
    category: 'display',
    icon: 'Tag',
  },
};

// Helper function to get component by name
export function getComponent(name: string) {
  const component = componentRegistry[name as keyof typeof componentRegistry];
  if (!component) {
    throw new Error(`Component "${name}" not found in registry`);
  }
  return component;
}

// Helper function to get component category
export function getComponentCategory(name: string) {
  const component = componentRegistry[name as keyof typeof componentRegistry];
  if (!component) {
    return 'unknown';
  }
  return component.category;
}

// Export registry for Puck configuration
export { componentRegistry, getComponent, getComponentCategory };
