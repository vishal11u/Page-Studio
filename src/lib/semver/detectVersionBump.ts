import type { Page } from '@/types/page';
import { comparePages, type PageDiff } from './comparePages';

export type SemVerBump = 'patch' | 'minor' | 'major';

export function detectVersionBump(
  previous: Page | null,
  next: Page,
): SemVerBump {
  if (!previous) return 'minor';

  const diff = comparePages(previous, next);

  if (
    diff.removedSections.length > 0 ||
    diff.typeChanges.length > 0 ||
    diff.requiredPropBreaks.length > 0
  ) {
    return 'major';
  }

  if (diff.addedSections.length > 0 || diff.optionalPropAdditions.length > 0) {
    return 'minor';
  }

  if (diff.propChanges.length > 0) {
    return 'patch';
  }

  return 'patch';
}

export function bumpVersion(current: string, bump: SemVerBump): string {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (bump) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

export function getInitialVersion(): string {
  return '0.1.0';
}

export { comparePages };
export type { PageDiff };
