'use client';

import { createElement } from 'react';
import type { Section } from '@/types/page';
import { getSectionComponent, sectionRegistry } from '@/registry/sectionRegistry';
import { validateSection } from '@/lib/validation/validateSection';
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary';
import { InvalidSection } from '@/components/sections/InvalidSection';
import { UnsupportedSection } from '@/components/sections/UnsupportedSection';

type SectionRendererProps = {
  section: Section;
};

export function SectionRenderer({ section }: SectionRendererProps) {
  if (!(section.type in sectionRegistry)) {
    return (
      <UnsupportedSection
        props={{ type: section.type }}
        sectionId={section.id}
      />
    );
  }

  const validation = validateSection(section);

  if (!validation.success) {
    return <InvalidSection section={section} errors={validation.errors} />;
  }

  const Resolved = getSectionComponent(section.type);

  return (
    <SectionErrorBoundary sectionId={section.id}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      {createElement(Resolved, {
        props: validation.data.props,
        sectionId: section.id,
      })}
    </SectionErrorBoundary>
  );
}
