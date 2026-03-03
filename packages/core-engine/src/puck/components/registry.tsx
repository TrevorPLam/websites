/**
 * @file packages/core-engine/src/puck/components/registry.tsx
 * @summary Component registry for Puck editor with UI components and layout elements.
 * @description Provides component definitions and utilities for Puck visual editor integration.
 * @security No direct security concerns; components are rendered client-side with proper sanitization.
 * @adr none
 * @requirements DOMAIN-3 / core-engine-implementation
 */
import { Badge, Button, Card, Input, Select, Textarea } from '@repo/ui';
import { Container, Section } from '@repo/ui/layout';
import React from 'react';

// Inline components for @repo/ui parts not yet available
const Heading: React.FC<{
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
  className?: string;
}> = ({ level = 'h2', children, className = 'text-2xl font-bold' }) => {
  return React.createElement(level, { className }, children);
};

const Image: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt?: string }
> = ({ src, alt = 'Image', className = 'w-full h-auto object-cover rounded-md', ...props }) => {
  return <img src={src} alt={alt} className={className} {...props} />;
};

const Link: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string; children?: React.ReactNode }
> = ({ href = '#', children, className = 'text-blue-600 hover:text-blue-800', ...props }) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

const Grid: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }> = ({
  children,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

// Component registry for Puck editor
export const componentRegistry = {
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
    component: ({ children, ...props }: { children?: React.ReactNode; [k: string]: unknown }) => (
      <p className="text-gray-600 mb-4" {...props}>
        {children}
      </p>
    ),
    category: 'text',
    icon: 'Type',
  },
  text: {
    component: ({ children, ...props }: { children?: React.ReactNode; [k: string]: unknown }) => (
      <span className="text-gray-600" {...props}>
        {children}
      </span>
    ),
    category: 'text',
    icon: 'Type',
  },
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
  button: {
    component: Button,
    defaultProps: {
      variant: 'primary',
      size: 'medium',
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

/**
 * Get a component definition by name from the registry.
 * @param name - The component name to look up.
 * @returns The component definition with configuration.
 * @throws Error if component is not found in registry.
 */
export function getComponent(name: string) {
  const component = componentRegistry[name as keyof typeof componentRegistry];
  if (!component) {
    throw new Error(`Component "${name}" not found in registry`);
  }
  return component;
}

/**
 * Get the category of a component by name.
 * @param name - The component name to look up.
 * @returns The category string or 'unknown' if not found.
 */
export function getComponentCategory(name: string) {
  const component = componentRegistry[name as keyof typeof componentRegistry];
  if (!component) {
    return 'unknown';
  }
  return component.category;
}
