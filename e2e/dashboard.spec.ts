import { test, expect } from '@playwright/test';

test('should render dashboard shell and mount canvas without errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // ?mode=mock forces the MockDataSource (the mocked API layer)
  await page.goto('/?mode=mock');

  // Verify header elements
  await expect(page.locator('text=TraceFlow')).toBeVisible();
  await expect(page.locator('text=node-us-east-01').first()).toBeVisible();
  await expect(page.locator('button', { hasText: '24h' }).first()).toBeVisible();

  // Verify the resolved data-source badge reports the mock stream
  await expect(page.locator('text=MOCK STREAM')).toBeVisible();

  // Verify canvas mounts (Primary + Correlation)
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveCount(2);

  // Verify live anomaly rows render (derived from the buffer, not static)
  await expect(page.locator('td >> text=NODE_US_EAST_01').first()).toBeVisible();

  // Verify no console errors
  expect(consoleErrors.filter(e => !e.includes('favicon'))).toHaveLength(0);
});

test('should support custom range selection via popover', async ({ page }) => {
  await page.goto('/?mode=mock');

  // Open the custom range popover — opening alone must not commit URL params
  await page.locator('button', { hasText: 'custom' }).click();
  const fromInput = page.locator('input[type="datetime-local"]').first();
  const toInput = page.locator('input[type="datetime-local"]').nth(1);
  await expect(fromInput).toBeVisible();
  await expect(toInput).toBeVisible();
  await expect(page).not.toHaveURL(/range=custom/);

  await fromInput.fill('2025-10-21T00:00');
  await toInput.fill('2025-10-22T00:00');

  // URL must carry range=custom + from/to params after the user picks dates
  await expect(page).toHaveURL(/range=custom/);
  await expect(page).toHaveURL(/from=/);
  await expect(page).toHaveURL(/to=/);

  // Charts still mounted after the window change
  await expect(page.locator('canvas')).toHaveCount(2);
});

test('should persist nuqs filters across page reloads', async ({ page }) => {
  await page.goto('/?mode=mock&siteId=node-eu-west-02&range=1h&compare=none');

  await expect(page).toHaveURL(/siteId=node-eu-west-02/);
  await expect(page.locator('text=node-eu-west-02').first()).toBeVisible();
  // compare=none hides the correlation chart — only the primary canvas mounts
  await expect(page.locator('canvas')).toHaveCount(1);

  await page.reload();

  // Filters survive the reload and the dashboard still renders
  await expect(page).toHaveURL(/siteId=node-eu-west-02/);
  await expect(page).toHaveURL(/range=1h/);
  await expect(page).toHaveURL(/compare=none/);
  await expect(page.locator('canvas')).toHaveCount(1);
});
