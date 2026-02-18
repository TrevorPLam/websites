/**
 * @file packages/marketing-components/src/hero/HeroWithForm.tsx
 * @role component
 * @summary Hero with embedded form
 *
 * Hero variant that includes an embedded contact/newsletter form.
 */

import { Button, Form, Input, Textarea } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { z } from 'zod';
import type { BaseHeroProps } from './types';

const defaultFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  message: z.string().optional(),
});

export interface HeroWithFormProps extends BaseHeroProps {
  /** Form schema (Zod) */
  formSchema?: z.ZodSchema;
  /** Form submit handler */
  onSubmit: (data: unknown) => void | Promise<void>;
  /** Form fields configuration */
  fields?: {
    name?: boolean;
    email?: boolean;
    message?: boolean;
    phone?: boolean;
  };
}

/**
 * Hero section with embedded form.
 *
 * @param props - HeroWithFormProps
 * @returns Hero section component
 */
export function HeroWithForm({
  title,
  subtitle,
  description,
  formSchema = defaultFormSchema,
  onSubmit,
  fields = { name: true, email: true, message: true },
  className,
  children,
}: HeroWithFormProps) {
  return (
    <Section className={cn('relative', className)}>
      <Container className="py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {description}
              </p>
            )}
            {children}
          </div>
          <div>
            <Form schema={formSchema} onSubmit={onSubmit}>
              {fields.name && <Input label="Name" name="name" required />}
              {fields.email && <Input label="Email" type="email" name="email" required />}
              {fields.phone && <Input label="Phone" type="tel" name="phone" />}
              {fields.message && <Textarea label="Message" name="message" />}
              <Button type="submit" size="large" className="w-full">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
