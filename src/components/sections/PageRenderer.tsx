import type { Page } from '@/types/page';
import { SectionRenderer } from './SectionRenderer';

type PageRendererProps = {
  page: Page;
};

export function PageRenderer({ page }: PageRendererProps) {
  if (page.sections.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6" role="status">
        <p className="text-muted-foreground">This page has no sections yet.</p>
      </div>
    );
  }

  return (
    <article>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </article>
  );
}
