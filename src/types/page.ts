export type SectionType = 'hero' | 'featureGrid' | 'testimonial' | 'cta';

export type Section = {
  id: string;
  type: SectionType | string;
  props: Record<string, unknown>;
};

export type Page = {
  pageId: string;
  slug: string;
  title: string;
  sections: Section[];
};

export type ReleaseSnapshot = {
  version: string;
  slug: string;
  publishedAt: string;
  page: Page;
  changelog: string[];
};
