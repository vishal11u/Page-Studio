import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test.describe('Preview', () => {
  test('renders home preview', async ({ page }) => {
    await page.goto('/preview/home');
    await expect(page.getByRole('heading', { level: 1, name: 'Page Studio MVP' })).toBeVisible();
  });

  test('CTA is clickable', async ({ page }) => {
    await page.goto('/preview/home');
    const cta = page.getByTestId('cta-link');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/preview/home');
  });

  test('passes axe accessibility scan', async ({ page }) => {
    await page.goto('/preview/home');
    const results = await new AxeBuilder({ page }).analyze();

    const reportPath = path.join(process.cwd(), 'a11y-report.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          url: page.url(),
          timestamp: new Date().toISOString(),
          violations: results.violations,
          passes: results.passes.length,
          incomplete: results.incomplete.length,
        },
        null,
        2,
      ),
    );

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
