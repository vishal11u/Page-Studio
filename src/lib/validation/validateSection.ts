import type { Section, SectionType } from '@/types/page';
import { sectionSchemas } from './sectionSchemas';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function validateSectionProps(
  type: string,
  props: Record<string, unknown>,
): ValidationResult<Record<string, unknown>> {
  const schema = sectionSchemas[type as keyof typeof sectionSchemas];
  if (!schema) {
    return { success: false, errors: [`Unknown section type: ${type}`] };
  }

  const result = schema.safeParse(props);
  if (result.success) {
    return { success: true, data: result.data as Record<string, unknown> };
  }

  return {
    success: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    ),
  };
}

export function validateSection(section: Section): ValidationResult<Section> {
  const propsResult = validateSectionProps(section.type, section.props);
  if (!propsResult.success) {
    return { success: false, errors: propsResult.errors };
  }
  return {
    success: true,
    data: { ...section, props: propsResult.data },
  };
}

export function safeParseSection(
  type: string,
  props: unknown,
): ValidationResult<{ type: SectionType; props: Record<string, unknown> }> {
  if (!(type in sectionSchemas)) {
    return { success: false, errors: [`Unsupported section type: ${type}`] };
  }

  const sectionType = type as SectionType;
  const schema = sectionSchemas[sectionType];
  const result = schema.safeParse(props ?? {});

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      ),
    };
  }

  return {
    success: true,
    data: { type: sectionType, props: result.data as Record<string, unknown> },
  };
}
