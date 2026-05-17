import { test, expect } from '@playwright/test';

test.describe('Studio RBAC', () => {
  test('viewer is blocked from studio', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'page-studio-role',
        value: 'viewer',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);

    await page.goto('/studio/home');
    await expect(page).toHaveURL(/unauthorized/);
  });

  test('editor can access studio', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'page-studio-role',
        value: 'editor',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);

    await page.goto('/studio/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await expect(page.getByLabel('Studio editor')).toBeVisible();
  });
});
