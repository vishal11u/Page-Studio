import type { SectionComponentProps } from '@/registry/sectionRegistry';

export function UnsupportedSection({ props, sectionId }: SectionComponentProps) {
  const type = typeof props.type === 'string' ? props.type : 'unknown';

  return (
    <section
      role="region"
      aria-label="Unsupported section"
      className="border border-dashed border-destructive/50 bg-destructive/5 px-6 py-8"
      data-section-id={sectionId}
    >
      <p className="text-center text-sm text-destructive">
        Unsupported section type: <strong>{type}</strong>
      </p>
    </section>
  );
}
