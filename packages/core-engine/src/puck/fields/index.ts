import { z } from 'zod';

// Field configuration schemas for Puck components
export const HeadingFieldSchema = z.object({
  level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  text: z.string(),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const ButtonFieldSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'destructive']),
  size: z.enum(['sm', 'md', 'lg']),
  text: z.string(),
  href: z.string().url().optional(),
  onClick: z.string().optional(),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const ImageFieldSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const InputFieldSchema = z.object({
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']),
  placeholder: z.string(),
  required: z.boolean().default(false),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const CardFieldSchema = z.object({
  variant: z.enum(['default', 'elevated', 'outlined']),
  padding: z.enum(['sm', 'md', 'lg']),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const GridFieldSchema = z.object({
  columns: z.number().min(1).max(12).default(3),
  gap: z.enum(['sm', 'md', 'lg']).default('md'),
  className: z.string().optional(),
  id: z.string().optional(),
});

export const BadgeFieldSchema = z.object({
  variant: z.enum(['default', 'secondary', 'destructive', 'outline']),
  text: z.string(),
  className: z.string().optional(),
  id: z.string().optional(),
});

// Field configurations for Puck editor
export const puckFields = {
  heading: {
    level: {
      type: 'select',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'H6', value: 'h6' },
      ],
      defaultValue: 'h2',
    },
    text: {
      type: 'text',
      defaultValue: 'Heading text',
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  button: {
    variant: {
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Destructive', value: 'destructive' },
      ],
      defaultValue: 'primary',
    },
    size: {
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
      defaultValue: 'md',
    },
    text: {
      type: 'text',
      defaultValue: 'Click me',
    },
    href: {
      type: 'text',
      defaultValue: '',
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  image: {
    src: {
      type: 'text',
      defaultValue: '',
    },
    alt: {
      type: 'text',
      defaultValue: 'Image description',
    },
    width: {
      type: 'number',
      defaultValue: 400,
    },
    height: {
      type: 'number',
      defaultValue: 300,
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  input: {
    type: {
      type: 'select',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Number', value: 'number' },
        { label: 'Phone', value: 'tel' },
        { label: 'URL', value: 'url' },
      ],
      defaultValue: 'text',
    },
    placeholder: {
      type: 'text',
      defaultValue: 'Enter text...',
    },
    required: {
      type: 'checkbox',
      defaultValue: false,
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  card: {
    variant: {
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Elevated', value: 'elevated' },
        { label: 'Outlined', value: 'outlined' },
      ],
      defaultValue: 'default',
    },
    padding: {
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
      defaultValue: 'md',
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  grid: {
    columns: {
      type: 'number',
      min: 1,
      max: 12,
      defaultValue: 3,
    },
    gap: {
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
      defaultValue: 'md',
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
  
  badge: {
    variant: {
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
      ],
      defaultValue: 'default',
    },
    text: {
      type: 'text',
      defaultValue: 'Badge',
    },
    className: {
      type: 'text',
      defaultValue: '',
    },
  },
};

// Helper function to get field configuration
export function getFields(componentName: string) {
  return puckFields[componentName as keyof typeof puckFields] || {};
}

// Export schemas for validation
export type HeadingField = z.infer<typeof HeadingFieldSchema>;
export type ButtonField = z.infer<typeof ButtonFieldSchema>;
export type ImageField = z.infer<typeof ImageFieldSchema>;
export type InputField = z.infer<typeof InputFieldSchema>;
export type CardField = z.infer<typeof CardFieldSchema>;
export type GridField = z.infer<typeof GridFieldSchema>;
export type BadgeField = z.infer<typeof BadgeFieldSchema>;
