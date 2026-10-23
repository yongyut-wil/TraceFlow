import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 950 } });
await p.goto('http://localhost:3000/?mode=mock');
await p.waitForSelector('canvas');
await p.waitForTimeout(4000);
// zoom into markline area + open custom popover + select
await p.screenshot({ path: 'tf15.png', clip: { x: 0, y: 230, width: 700, height: 400 } });
await p.locator('button', { hasText: 'CUSTOM' }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: 'tf15-pop.png', clip: { x: 500, y: 0, width: 800, height: 400 } });
await b.close();
