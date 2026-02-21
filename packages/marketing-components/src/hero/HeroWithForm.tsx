'use client';

/**
 * @file packages/marketing-components/src/hero/HeroWithForm.tsx
 * @role component
 * @summary Hero with embedded form
 *
 * Hero variant that includes an embedded contact/newsletter form.
 */

import { Button, Form, Input, Textarea, FormField } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { z } from 'zod';
import type { BaseHeroProps } from './types';

const createFormSchema = (fields: HeroWithFormProps['fields'] = {}) =>
  z.object({
    email: z.string().email('Invalid email address'),
    name: fields.name ? z.string().min(1, 'Name is required') : z.string().optional(),
    message: fields.message ? z.string().min(1, 'Message is required') : z.string().optional(),
    phone: fields.phone ? z.string().min(1, 'Phone number is required') : z.string().optional(),
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
  formSchema,
  onSubmit,
  fields = { name: true, email: true, message: true },
  className,
  children,
}: HeroWithFormProps) {
  // Use dynamic schema based on fields, or fallback to provided schema
  const dynamicFormSchema = formSchema || createFormSchema(fields);
  return (
    <Section className={cn('relative', className)}>
      <Container className="py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{title}</h1>
            {subtitle && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">{subtitle}</p>
            )}
            {description && (
              <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
            )}
            {children}
          </div>
          <div>
            <Form schema={dynamicFormSchema} onSubmit={onSubmit}>
              {fields.name && (
                <FormField
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      value={field.value as string}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref as React.Ref<HTMLInputElement>}
                      label="Name"
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
              {fields.email && (
                <FormField
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      value={field.value as string}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref as React.Ref<HTMLInputElement>}
                      type="email"
                      label="Email"
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
              {fields.phone && (
                <FormField
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Input
                      value={field.value as string}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref as React.Ref<HTMLInputElement>}
                      type="tel"
                      label="Phone"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
              {fields.message && (
                <FormField
                  name="message"
                  render={({ field, fieldState }) => (
                    <Textarea
                      value={field.value as string}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref as React.Ref<HTMLTextAreaElement>}
                      label="Message"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
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
