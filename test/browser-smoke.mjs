import { escapeHtml } from '../backend/shared/html.cjs';
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
  async function openScenario({ path = '/', status = 200, failMap = false, delayMap = false, respond } = {}) {
    const page = await browser.newPage();
    const errors = [];
    let helloRequests = 0;
    let releaseMap;
    const gate = new Promise(resolve => { releaseMap = resolve; });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => {
      if (route.request().url().endsWith('/respond') && respond) return respond(route);
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

  let stage = 'http';
  let receivedCommand;
  const requests = await openScenario({ respond: route => {
    if (stage === 'http') return route.fulfill({ status: 503, body: 'private server details' });
    if (stage === 'invalid') return route.fulfill({ status: 200, body: '{invalid json' });
    if (stage === 'timeout') return;
    receivedCommand = route.request().postDataJSON().command;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      username: receivedCommand, clearanceLevel: 0, keywords: [],
      terminalMessages: ['Username confirmed: ' + escapeHtml(receivedCommand), '<h>Authored formatting</h>'],
      newContext: 'station', rooms: {}, characters: {}, files: {}, characterFiles: {}, messages: {},
    }) });
  } });
  try {
    const page = requests.page;
    const prompt = page.locator('[data-terminal-input]');
    async function submit(text) {
      await prompt.waitFor({ timeout: 30000 });
      await page.keyboard.type(text);
      await page.keyboard.press('Enter');
    }
    for (const [failure, message] of [
      ['http', 'The server could not complete that command.'],
      ['invalid', 'The server returned an unreadable response.'],
      ['timeout', 'Connection timed out.'],
    ]) {
      stage = failure;
      await submit('test-player');
      await page.getByText(message, { exact: false }).first().waitFor({ timeout: 15000 });
      await prompt.waitFor();
      assert.equal(await page.evaluate(() => window.stateManager.getCurrentState()), 'username');
    }
    stage = 'success';
    const payload = 'A><img src=x onerror="window.__xss=1"> & $& <h>name</h>';
    await submit(payload);
    await page.waitForFunction(() => window.stateManager.getCurrentState() === 'station');
    await prompt.waitFor();
    assert.equal(receivedCommand, payload, 'Commands must arrive as raw text');
    assert.equal(await page.evaluate(() => window.stateManager.getUsername()), payload);
    assert.ok((await page.locator('#command-prompt').innerText()).includes('Username confirmed: ' + payload));
    assert.equal(await page.locator('#command-prompt img').count(), 0);
    assert.equal(await page.evaluate(() => window.__xss), undefined);
    assert.equal(await page.locator('#command-prompt .key').filter({ hasText: 'Authored formatting' }).count(), 1);
    assert.deepEqual(requests.errors, []);
    console.log('Command HTTP/JSON/timeout recovery, raw input, escaped username, and authored HTML: passed');
  } finally { await requests.page.close(); }

} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
