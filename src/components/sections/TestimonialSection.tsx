import type { SectionComponentProps } from '@/registry/sectionRegistry';
import { testimonialSchema } from '@/lib/validation/sectionSchemas';

export function TestimonialSection({ props, sectionId }: SectionComponentProps) {
  const parsed = testimonialSchema.safeParse(props);
  if (!parsed.success) return null;

  const { quote, author, role } = parsed.data;

  return (
    <section aria-labelledby={`testimonial-${sectionId}`} className="bg-muted/20 px-6 py-16">
      <figure className="mx-auto max-w-2xl text-center">
        <blockquote>
          <p id={`testimonial-${sectionId}`} className="text-xl italic">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-6">
          <cite className="not-italic font-medium">{author}</cite>
          {role && <span className="block text-sm text-muted-foreground">{role}</span>}
        </figcaption>
      </figure>
    </section>
  );
}
