import { test, expect, type Page } from '@playwright/test';

// ?mode=mock forces the MockDataSource for deterministic rendering.
// Console errors are collected per-test so interactions are held to the
// same zero-error bar as the initial load (favicon noise excluded).
function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      errors.push(msg.text());
    }
  });
  return errors;
}

test.describe('dashboard', () => {
  test('should render dashboard shell and mount canvas without errors', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock');

    // Verify header elements
    await expect(page.locator('text=TraceFlow').first()).toBeVisible();
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
    expect(consoleErrors).toHaveLength(0);
  });

  test('should support custom range selection via popover', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
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
    expect(consoleErrors).toHaveLength(0);
  });

  test('should persist nuqs filters across page reloads', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
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
    expect(consoleErrors).toHaveLength(0);
  });

  test('should update URL params and content via header selects', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock');
    await expect(page.locator('canvas')).toHaveCount(2);

    // Select order in the header: site, metric, compare, mode.
    const selects = page.getByRole('combobox');

    // Site switch → URL param + anomaly table node column follow.
    await selects.nth(0).click();
    await page.getByRole('option', { name: 'NODE_EU_WEST_02' }).click();
    await expect(page).toHaveURL(/siteId=node-eu-west-02/);
    await expect(page.locator('td >> text=NODE_EU_WEST_02').first()).toBeVisible();

    // Metric switch to throughput_rps collides with the default compare metric,
    // so the correlation chart must unmount instead of duplicating the series.
    await selects.nth(1).click();
    await page.getByRole('option', { name: 'Throughput (req/s)' }).click();
    await expect(page).toHaveURL(/metric=throughput_rps/);
    await expect(page.locator('canvas')).toHaveCount(1);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should mount and unmount the correlation chart via compare select', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock');
    await expect(page.locator('canvas')).toHaveCount(2);

    const compareSelect = page.getByRole('combobox').nth(2);

    // compare=none → correlation chart disposes cleanly.
    await compareSelect.click();
    await page.getByRole('option', { name: /none/i }).click();
    await expect(page).toHaveURL(/compare=none/);
    await expect(page.locator('canvas')).toHaveCount(1);

    // Re-selecting the default metric clears the param (nuqs clearOnDefault)
    // and re-initializes ECharts without errors.
    await compareSelect.click();
    await page.getByRole('option', { name: /throughput/i }).click();
    await expect(page).not.toHaveURL(/compare=/);
    await expect(page.locator('canvas')).toHaveCount(2);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should freeze the live stream while paused', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    // range=1h yields ~3,600 historical points — below the 10k cap, so the
    // buffer counter keeps growing while the stream is live.
    await page.goto('/?mode=mock&range=1h');

    const bufferInfo = page.getByText(/\/ 10,000 pts/);
    await expect(bufferInfo).toBeVisible();

    // Prove the counter ticks before asserting the freeze.
    const before = await bufferInfo.textContent();
    await expect.poll(() => bufferInfo.textContent(), { timeout: 3_000 }).not.toBe(before);

    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByText('PAUSED')).toBeVisible();

    // Let the batch that was in-flight at click time flush through, then
    // the counter must stay frozen — the stream is unsubscribed.
    await page.waitForTimeout(400);
    const frozen = await bufferInfo.textContent();
    await page.waitForTimeout(1_200);
    expect(await bufferInfo.textContent()).toBe(frozen);

    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
    await expect.poll(() => bufferInfo.textContent(), { timeout: 3_000 }).not.toBe(frozen);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should surface the source error state when supabase is unconfigured', async ({ page }) => {
    // webServer env forces empty Supabase credentials, so ?mode=supabase
    // deterministically resolves to the error path on every machine.
    await page.goto('/?mode=supabase');

    await expect(page.getByText('SOURCE ERROR')).toBeVisible();
    await expect(page.getByText('Source unavailable — check data mode')).toBeVisible();
    await expect(page.locator('footer').getByText('disconnected')).toBeVisible();
  });

  test('should zoom the primary chart from an anomaly row action', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock');
    await expect(page.locator('canvas')).toHaveCount(2);

    // Regression guard for the previously dead row action (ISSUE-001):
    // the dispatch must reach a live chart without throwing.
    const zoomButtons = page.getByRole('button', { name: 'Zoom primary chart to this event' });
    await expect(zoomButtons.first()).toBeVisible();
    await zoomButtons.first().click();

    await expect(page.locator('canvas')).toHaveCount(2);
    expect(consoleErrors).toHaveLength(0);
  });

  test('should fall back to defaults for invalid query params', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock&metric=bogus&range=zzz');

    // Literal parsers reject unknown values → defaults apply in the UI.
    // (SelectValue renders the raw value, not the item label.)
    await expect(page.getByRole('combobox').nth(1)).toHaveText(/latency_ms/);
    await expect(page.getByRole('button', { name: '24h', exact: true })).toHaveClass(/text-primary/);

    await expect(page.locator('canvas')).toHaveCount(2);
    expect(consoleErrors).toHaveLength(0);
  });

  test('should survive an inverted custom range window', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    // from > to is clamped to an empty historical window; the live stream
    // must still resume and start buffering fresh points.
    await page.goto('/?mode=mock&range=custom&from=2025-10-22T00:00:00.000Z&to=2025-10-21T00:00:00.000Z');

    await expect(page.getByText(/[1-9][\d,]* \/ 10,000 pts/)).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('canvas')).toHaveCount(2);
    expect(consoleErrors).toHaveLength(0);
  });

  test('should render KPI values and status bar telemetry', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/?mode=mock');

    // KPI cards resolve from skeleton/placeholder into real values.
    await expect(page.getByText(/pts buffered/)).toBeVisible();
    await expect(page.locator('.text-value').first()).toHaveText(/\d/);
    for (const title of ['Current Value', 'Window Mean', 'Peak', 'Anomalies']) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }

    // Terminal status line: node label, buffered count, connection, UTC clock.
    await expect(page.getByText('TERM·01')).toBeVisible();
    await expect(page.getByText(/PTS BUFFERED/)).toBeVisible();
    await expect(page.getByText(/\d{2}:\d{2}:\d{2} UTC/)).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test('should keep content inside a mobile viewport without horizontal overflow', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=mock');
    await expect(page.locator('canvas')).toHaveCount(2);

    // Regression guard for the responsive audit (ISSUE-008): the document
    // itself must never scroll horizontally.
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);

    await expect(page.locator('text=TraceFlow').first()).toBeVisible();
    await expect(page.getByText('TERM·01')).toBeVisible();
    expect(consoleErrors).toHaveLength(0);
  });
});
