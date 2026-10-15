import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + '/')) { response.writeHead(403).end(); return; }
  try {
    const data = await readFile(file);
    response.setHeader('Content-Type', { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html' }[extname(file)] || 'application/octet-stream');
    response.end(data);
  } catch {
    if (!extname(pathname)) {
      response.setHeader('Content-Type', 'text/html');
      response.end(await readFile(resolve(root, 'index.html')));
    } else response.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  async function openScenario({ path = '/', status = 200, failMap = false, delayMap = false } = {}) {
    const page = await browser.newPage();
    const errors = [];
    let helloRequests = 0;
    let releaseMap;
    const gate = new Promise(resolve => { releaseMap = resolve; });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => {
      helloRequests++;
      return route.fulfill({ status, contentType: 'application/json', body: '"ok"' });
    });
    if (failMap || delayMap) {
      await page.route('**/brinkterminal_v21.riv', async route => {
        if (failMap) return route.abort();
        await gate;
        return route.continue();
      });
    }
    await page.goto(`http://127.0.0.1:${server.address().port}${path}`, { waitUntil: 'load', timeout: 45000 });
    return { page, errors, releaseMap, helloRequests: () => helloRequests };
  }

  // Test the real production entry, including an animation/API readiness race.
  const delayed = await openScenario({ delayMap: true });
  try {
    await delayed.page.waitForTimeout(150);
    assert.equal(delayed.helloRequests(), 0, 'API check must wait for animation readiness');
    assert.equal(await delayed.page.locator('#command-prompt').innerText(), '');
    delayed.releaseMap();
    await delayed.page.getByText('Enter a username:', { exact: false }).first().waitFor({ timeout: 30000 });
    assert.equal(await delayed.page.title(), 'Brink Terminal');
    assert.equal(delayed.helloRequests(), 1);
    assert.deepEqual(delayed.errors, []);
    const text = await delayed.page.locator('#command-prompt').innerText();
    assert.equal((text.match(/Enter a username:/g) || []).length, 1, 'Startup prompt must appear once');
    console.log('Production startup, readiness barrier, and single prompt: passed');
  } finally { delayed.releaseMap(); await delayed.page.close(); }

  const chapter = await openScenario({ path: '/cleanup-test-card' });
  try {
    await chapter.page.getByText('Congratulations, you have found a Brink Terminal key card!', { exact: false }).first().waitFor({ timeout: 30000 });
    assert.deepEqual(chapter.errors, []);
    console.log('Chapter/key-card startup: passed');
  } finally { await chapter.page.close(); }

  const offline = await openScenario({ status: 503 });
  try {
    await offline.page.waitForFunction(() => window.stateManager?.getCurrentState() === 'connectionError', undefined, { timeout: 30000 });
    assert.deepEqual(offline.errors, []);
    console.log('API failure startup: passed');
  } finally { await offline.page.close(); }

  const missingAnimation = await openScenario({ failMap: true });
  try {
    await missingAnimation.page.getByText('Unable to start', { exact: true }).waitFor({ timeout: 30000 });
    assert.equal(missingAnimation.helloRequests(), 0);
    assert.deepEqual(missingAnimation.errors, []);
    console.log('Animation failure startup: passed');
  } finally { await missingAnimation.page.close(); }

} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
