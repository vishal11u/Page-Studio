import { describe, expect, it } from 'vitest';
import { comparePages, pagesAreEqual } from '@/lib/semver/comparePages';
import { detectVersionBump } from '@/lib/semver/detectVersionBump';
import type { Page } from '@/types/page';

const basePage: Page = {
  pageId: '1',
  slug: 'home',
  title: 'Home',
  sections: [
    {
      id: 'a',
      type: 'hero',
      props: { headline: 'Hi', subheadline: 'There' },
    },
  ],
};

describe('semver', () => {
  it('detects patch for text changes', () => {
    const next: Page = {
      ...basePage,
      sections: [
        {
          ...basePage.sections[0],
          props: { headline: 'Hello', subheadline: 'There' },
        },
      ],
    };
    expect(detectVersionBump(basePage, next)).toBe('patch');
  });

  it('detects minor for added section', () => {
    const next: Page = {
      ...basePage,
      sections: [
        ...basePage.sections,
        {
          id: 'b',
          type: 'cta',
          props: { label: 'Go', url: 'https://example.com' },
        },
      ],
    };
    expect(detectVersionBump(basePage, next)).toBe('minor');
  });

  it('detects major for removed section', () => {
    const next: Page = { ...basePage, sections: [] };
    expect(detectVersionBump(basePage, next)).toBe('major');
  });

  it('reports equal pages', () => {
    expect(pagesAreEqual(basePage, { ...basePage })).toBe(true);
    const diff = comparePages(basePage, basePage);
    expect(diff.addedSections).toHaveLength(0);
  });
});
