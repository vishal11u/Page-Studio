import Link from 'next/link';
import type { SectionComponentProps } from '@/registry/sectionRegistry';
import { ctaSchema } from '@/lib/validation/sectionSchemas';

export function CtaSection({ props, sectionId }: SectionComponentProps) {
  const parsed = ctaSchema.safeParse(props);
  if (!parsed.success) return null;

  const { label, url, description } = parsed.data;

  return (
    <section aria-labelledby={`cta-heading-${sectionId}`} className="px-6 py-16">
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        {description && (
          <p className="mb-4 text-muted-foreground">{description}</p>
        )}
        <h2 id={`cta-heading-${sectionId}`} className="sr-only">
          Call to action
        </h2>
        <Link
          href={url}
          data-testid="cta-link"
          className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
