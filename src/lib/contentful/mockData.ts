import type { Page } from '@/types/page';

export const MOCK_PAGES: Record<string, Page> = {
  home: {
    pageId: 'mock-home',
    slug: 'home',
    title: 'Home',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          headline: 'Page Studio MVP',
          subheadline: 'Schema-driven CMS landing pages',
          ctaLabel: 'Open Studio',
          ctaUrl: '/studio/home',
        },
      },
      {
        id: 'features-1',
        type: 'featureGrid',
        props: {
          title: 'Built for teams',
          features: [
            { title: 'Draft editing', description: 'Redux-managed WYSIWYG-lite studio' },
            { title: 'Immutable releases', description: 'SemVer publish snapshots' },
            { title: 'Accessible by default', description: 'WCAG-oriented components' },
          ],
        },
      },
      {
        id: 'cta-1',
        type: 'cta',
        props: {
          label: 'Preview page',
          url: '/preview/home',
          description: 'See the published preview experience.',
        },
      },
    ],
  },
  demo: {
    pageId: 'mock-demo',
    slug: 'demo',
    title: 'Demo Page',
    sections: [
      {
        id: 'hero-demo',
        type: 'hero',
        props: {
          headline: 'Demo Landing',
          subheadline: 'Try the studio editor',
        },
      },
      {
        id: 'testimonial-demo',
        type: 'testimonial',
        props: {
          quote: 'A clean architecture for content teams.',
          author: 'Alex Rivera',
          role: 'Product Lead',
        },
      },
    ],
  },
};
