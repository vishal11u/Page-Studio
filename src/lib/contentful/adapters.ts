import type { Entry, EntrySkeletonType } from 'contentful';
import type { Page, Section } from '@/types/page';
import { createContentfulClient, type ContentfulMode } from './contentfulClient';
import { MOCK_PAGES } from './mockData';

type ContentfulSectionFields = {
  id?: string;
  type?: string;
  props?: Record<string, unknown>;
};

type ContentfulPageFields = {
  slug?: string;
  title?: string;
  sections?: ContentfulSectionFields[];
};

type PageEntrySkeleton = EntrySkeletonType & {
  contentTypeId: 'page';
  fields: ContentfulPageFields;
};

export function mapContentfulPageToPageModel(
  entry: Entry<PageEntrySkeleton, undefined, string>,
): Page {
  const fields = entry.fields;
  const sectionsRaw: ContentfulSectionFields[] = fields.sections ?? [];
  const sections: Section[] = sectionsRaw.map((raw, index) => ({
    id: raw.id ?? `section-${index}`,
    type: raw.type ?? 'hero',
    props: raw.props ?? {},
  }));

  return {
    pageId: entry.sys.id,
    slug: fields.slug ?? entry.sys.id,
    title: fields.title ?? 'Untitled',
    sections,
  };
}

export async function getPageBySlug(
  slug: string,
  mode: ContentfulMode = 'published',
): Promise<Page | null> {
  const client = createContentfulClient(mode);

  if (!client) {
    return MOCK_PAGES[slug] ?? null;
  }

  try {
    const response = await client.getEntries<PageEntrySkeleton>({
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
    });

    const entry = response.items[0];
    if (!entry) {
      return MOCK_PAGES[slug] ?? null;
    }

    return mapContentfulPageToPageModel(entry);
  } catch (error) {
    console.error('Contentful fetch error:', error);
    return MOCK_PAGES[slug] ?? null;
  }
}
