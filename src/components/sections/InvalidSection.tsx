import type { Section } from '@/types/page';

type InvalidSectionProps = {
  section: Section;
  errors: string[];
};

export function InvalidSection({ section, errors }: InvalidSectionProps) {
  return (
    <section
      role="alert"
      aria-live="polite"
      className="border border-amber-500/50 bg-amber-50 px-6 py-6 dark:bg-amber-950/20"
      data-section-id={section.id}
    >
      <h2 className="text-sm font-medium text-amber-800 dark:text-amber-200">
        Invalid section data ({section.type})
      </h2>
      <ul className="mt-2 list-inside list-disc text-sm text-amber-700 dark:text-amber-300">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </section>
  );
}
