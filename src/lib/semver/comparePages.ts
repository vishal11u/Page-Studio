import type { Page } from '@/types/page';
import { sectionSchemas } from '@/lib/validation/sectionSchemas';

export type PageDiff = {
  addedSections: string[];
  removedSections: string[];
  typeChanges: Array<{ id: string; from: string; to: string }>;
  propChanges: Array<{ sectionId: string; path: string }>;
  optionalPropAdditions: Array<{ sectionId: string; path: string }>;
  requiredPropBreaks: Array<{ sectionId: string; path: string }>;
};

function getRequiredKeys(type: string): string[] {
  const schema = sectionSchemas[type as keyof typeof sectionSchemas];
  if (!schema) return [];

  const shape = (schema as { shape?: Record<string, unknown> }).shape;
  if (!shape) return [];

  return Object.entries(shape)
    .filter(([, field]) => {
      const inner = field as { isOptional?: () => boolean };
      return typeof inner.isOptional === 'function' ? !inner.isOptional() : true;
    })
    .map(([key]) => key);
}

function flattenProps(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenProps(value as Record<string, unknown>, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}

export function comparePages(previous: Page | null, next: Page): PageDiff {
  const prevMap = new Map((previous?.sections ?? []).map((s) => [s.id, s]));
  const nextMap = new Map(next.sections.map((s) => [s.id, s]));

  const diff: PageDiff = {
    addedSections: [],
    removedSections: [],
    typeChanges: [],
    propChanges: [],
    optionalPropAdditions: [],
    requiredPropBreaks: [],
  };

  for (const [id] of nextMap) {
    if (!prevMap.has(id)) {
      diff.addedSections.push(id);
    }
  }

  for (const [id] of prevMap) {
    if (!nextMap.has(id)) {
      diff.removedSections.push(id);
    }
  }

  for (const [id, nextSection] of nextMap) {
    const prevSection = prevMap.get(id);
    if (!prevSection) continue;

    if (prevSection.type !== nextSection.type) {
      diff.typeChanges.push({
        id,
        from: prevSection.type,
        to: nextSection.type,
      });
      continue;
    }

    const prevFlat = flattenProps(prevSection.props);
    const nextFlat = flattenProps(nextSection.props);
    const required = new Set(getRequiredKeys(nextSection.type));

    const allKeys = new Set([...Object.keys(prevFlat), ...Object.keys(nextFlat)]);

    for (const path of allKeys) {
      const had = path in prevFlat;
      const has = path in nextFlat;

      if (!had && has) {
        if (required.has(path.split('.')[0])) {
          diff.optionalPropAdditions.push({ sectionId: id, path });
        } else {
          diff.optionalPropAdditions.push({ sectionId: id, path });
        }
        continue;
      }

      if (had && !has) {
        if (required.has(path.split('.')[0])) {
          diff.requiredPropBreaks.push({ sectionId: id, path });
        }
        continue;
      }

      if (JSON.stringify(prevFlat[path]) !== JSON.stringify(nextFlat[path])) {
        diff.propChanges.push({ sectionId: id, path });
      }
    }
  }

  return diff;
}

export function pagesAreEqual(a: Page | null, b: Page): boolean {
  if (!a) return false;
  const diff = comparePages(a, b);
  return (
    diff.addedSections.length === 0 &&
    diff.removedSections.length === 0 &&
    diff.typeChanges.length === 0 &&
    diff.propChanges.length === 0 &&
    diff.optionalPropAdditions.length === 0 &&
    diff.requiredPropBreaks.length === 0
  );
}

export function normalizePage(page: Page): Page {
  return JSON.parse(JSON.stringify(page)) as Page;
}
