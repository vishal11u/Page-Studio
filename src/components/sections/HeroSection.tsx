import Link from 'next/link';
import type { SectionComponentProps } from '@/registry/sectionRegistry';
import { heroSchema } from '@/lib/validation/sectionSchemas';

export function HeroSection({ props, sectionId }: SectionComponentProps) {
  const parsed = heroSchema.safeParse(props);
  if (!parsed.success) return null;

  const { headline, subheadline, ctaLabel, ctaUrl } = parsed.data;

  return (
    <section
      aria-labelledby={`hero-heading-${sectionId}`}
      className="border-b border-border bg-muted/30 px-6 py-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1 id={`hero-heading-${sectionId}`} className="text-4xl font-bold tracking-tight">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 text-lg text-muted-foreground">{subheadline}</p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="mt-8">
            <Link
              href={ctaUrl}
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
