import type { ComponentType } from 'react';
import type { SectionType } from '@/types/page';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGridSection } from '@/components/sections/FeatureGridSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { UnsupportedSection } from '@/components/sections/UnsupportedSection';
import {
  heroSchema,
  featureGridSchema,
  testimonialSchema,
  ctaSchema,
} from '@/lib/validation/sectionSchemas';
import type { z } from 'zod';

export type SectionComponentProps = {
  props: Record<string, unknown>;
  sectionId: string;
};

type RegistryEntry = {
  component: ComponentType<SectionComponentProps>;
  schema: z.ZodType<Record<string, unknown>>;
  label: string;
  defaultProps: Record<string, unknown>;
};

export const sectionRegistry: Record<SectionType, RegistryEntry> = {
  hero: {
    component: HeroSection,
    schema: heroSchema,
    label: 'Hero',
    defaultProps: {
      headline: 'Welcome',
      subheadline: 'Build beautiful pages',
      ctaLabel: 'Get started',
      ctaUrl: 'https://example.com',
    },
  },
  featureGrid: {
    component: FeatureGridSection,
    schema: featureGridSchema,
    label: 'Feature Grid',
    defaultProps: {
      title: 'Features',
      features: [
        { title: 'Fast', description: 'Lightning quick performance' },
        { title: 'Secure', description: 'Enterprise-grade security' },
      ],
    },
  },
  testimonial: {
    component: TestimonialSection,
    schema: testimonialSchema,
    label: 'Testimonial',
    defaultProps: {
      quote: 'This product changed our workflow.',
      author: 'Jane Doe',
      role: 'CTO',
    },
  },
  cta: {
    component: CtaSection,
    schema: ctaSchema,
    label: 'Call to Action',
    defaultProps: {
      label: 'Sign up',
      url: 'https://example.com/signup',
      description: 'Start your free trial today.',
    },
  },
};

export const sectionTypes = Object.keys(sectionRegistry) as SectionType[];

export function getSectionComponent(type: string): ComponentType<SectionComponentProps> {
  if (type in sectionRegistry) {
    return sectionRegistry[type as SectionType].component;
  }
  return UnsupportedSection;
}

export function getDefaultSectionProps(type: SectionType): Record<string, unknown> {
  return { ...sectionRegistry[type].defaultProps };
}
