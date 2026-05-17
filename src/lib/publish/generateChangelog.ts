import type { PageDiff } from '@/lib/semver/comparePages';
import type { SemVerBump } from '@/lib/semver/detectVersionBump';

export function generateChangelog(diff: PageDiff, bump: SemVerBump): string[] {
  const entries: string[] = [];

  if (diff.addedSections.length > 0) {
    entries.push(`Added sections: ${diff.addedSections.join(', ')}`);
  }

  if (diff.removedSections.length > 0) {
    entries.push(`Removed sections: ${diff.removedSections.join(', ')}`);
  }

  for (const change of diff.typeChanges) {
    entries.push(
      `Changed section ${change.id} type from ${change.from} to ${change.to}`,
    );
  }

  for (const change of diff.propChanges) {
    entries.push(`Updated ${change.sectionId}.${change.path}`);
  }

  for (const change of diff.optionalPropAdditions) {
    entries.push(`Added optional prop ${change.sectionId}.${change.path}`);
  }

  for (const change of diff.requiredPropBreaks) {
    entries.push(`Breaking: removed required prop ${change.sectionId}.${change.path}`);
  }

  if (entries.length === 0) {
    entries.push(`No content changes detected (${bump} bump policy applied)`);
  }

  return entries;
}
