import type { SectionComponentProps } from '@/registry/sectionRegistry';
import { featureGridSchema } from '@/lib/validation/sectionSchemas';

export function FeatureGridSection({ props, sectionId }: SectionComponentProps) {
  const parsed = featureGridSchema.safeParse(props);
  if (!parsed.success) return null;

  const { title, features } = parsed.data;

  return (
    <section aria-labelledby={`features-heading-${sectionId}`} className="px-6 py-16">
      <h2 id={`features-heading-${sectionId}`} className="mb-10 text-center text-3xl font-semibold">
        {title}
      </h2>
      <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {features.map((feature, index) => (
          <li key={index} className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-medium">{feature.title}</h3>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
