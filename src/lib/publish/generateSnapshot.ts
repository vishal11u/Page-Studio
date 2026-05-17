import type { Page, ReleaseSnapshot } from '@/types/page';
import type { SemVerBump } from '@/lib/semver/detectVersionBump';

export function generateSnapshot(
  page: Page,
  version: string,
  changelog: string[],
): ReleaseSnapshot {
  return {
    version,
    slug: page.slug,
    publishedAt: new Date().toISOString(),
    page: structuredClone(page),
    changelog,
  };
}

export function snapshotFingerprint(page: Page): string {
  return JSON.stringify({
    slug: page.slug,
    title: page.title,
    sections: page.sections,
  });
}

export type PublishResult = {
  created: boolean;
  version: string;
  bump: SemVerBump;
  snapshot: ReleaseSnapshot;
};
