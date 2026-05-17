import { describe, expect, it } from 'vitest';
import { validateSectionProps, safeParseSection } from '@/lib/validation/validateSection';

describe('section validation', () => {
  it('validates hero props', () => {
    const result = validateSectionProps('hero', {
      headline: 'Hello',
      subheadline: 'World',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid CTA url', () => {
    const result = validateSectionProps('cta', {
      label: 'Go',
      url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('handles unknown section types', () => {
    const result = safeParseSection('unknown', {});
    expect(result.success).toBe(false);
  });
});
