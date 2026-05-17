import { z } from 'zod';

/** Absolute http(s) URL or root-relative path (Next.js `Link`-friendly). */
export const hrefSchema = z
  .string()
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
    'Must be empty, a root-relative path, or an http(s) URL',
  );

export const heroSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: hrefSchema.optional().or(z.literal('')),
});

export const featureGridSchema = z.object({
  title: z.string().min(1),
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().optional(),
});

export const ctaSchema = z.object({
  label: z.string().min(1),
  url: hrefSchema,
  description: z.string().optional(),
});

export const sectionSchemas = {
  hero: heroSchema,
  featureGrid: featureGridSchema,
  testimonial: testimonialSchema,
  cta: ctaSchema,
} as const;

export type SectionSchemaKey = keyof typeof sectionSchemas;
