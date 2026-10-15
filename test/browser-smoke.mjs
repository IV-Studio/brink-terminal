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
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Test the actual production entry without writing gameplay events to the live API.
  await page.route('**/api/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '"ok"' }));
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load', timeout: 45000 });
  try {
    await page.getByText('Enter a username:', { exact: false }).first().waitFor({ timeout: 20000 });
  } catch (error) {
    assert.deepEqual(errors, [], 'Production bundle raised browser errors');
    throw error;
  }
  assert.equal(await page.title(), 'Brink Terminal');
  assert.deepEqual(errors, []);
  console.log('Production bundle startup and username prompt: passed');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
