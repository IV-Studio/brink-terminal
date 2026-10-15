const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_URL = 'postgres://localhost/test';
const { createApp } = require('../server');

test('admin access is protected and normal gameplay has no username bypass', async () => {
  let logReads = 0;
  const logged = [];
  const app = createApp({
    logCommand: response => logged.push(response),
    logCombat() {},
    getInfo: async () => { logReads++; return { rows: [] }; }
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, options) => fetch(base + path, options);
  try {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    assert.equal((await request('/api/command-logs')).status, 503);
    assert.equal((await request('/admin/logs')).status, 503);
    process.env.ADMIN_USERNAME = 'test-admin';
    process.env.ADMIN_PASSWORD = 'test-password:with-colon';
    for (const path of ['/api/command-logs', '/admin/logs']) {
      const response = await request(path);
      assert.equal(response.status, 401);
      assert.match(response.headers.get('www-authenticate'), /^Basic /);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    assert.equal(logReads, 0);
    const auth = { Authorization: 'Basic ' + Buffer.from('test-admin:test-password:with-colon').toString('base64') };
    assert.equal((await request('/api/command-logs', { headers: { Authorization: 'Basic bad' } })).status, 401);
    const logs = await request('/api/command-logs', { headers: auth });
    assert.equal(logs.status, 200);
    assert.deepEqual(await logs.json(), { rows: [] });
    assert.equal(logReads, 1);
    const viewer = await request('/admin/logs', { headers: auth });
    assert.equal(viewer.status, 200);
    assert.match(await viewer.text(), /fetch\('\/api\/command-logs'\)/);
    const post = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const adminBody = post({ clearanceLevel: 3 });
    assert.equal((await request('/api/admin/clearance', adminBody)).status, 401);
    const admin = await request('/api/admin/clearance', { ...adminBody, headers: { ...adminBody.headers, ...auth } });
    assert.equal(admin.status, 200);
    assert.equal((await admin.json()).clearanceLevel, 3);
    const invalidBody = post({ clearanceLevel: 999 });
    assert.equal((await request('/api/admin/clearance', { ...invalidBody, headers: { ...invalidBody.headers, ...auth } })).status, 400);
    for (const username of ['regular-player', 'ivadmin999']) {
      const response = await request('/api/respond', post({ command: username, context: 'username', keywords: [] }));
      assert.equal(response.status, 200);
      const data = await response.json();
      assert.equal(data.username, username);
      assert.equal(data.clearanceLevel, 0);
      assert.equal(data.newContext, 'station');
    }
    assert.equal(logged.length, 2);
    assert.equal((await request('/api/hello')).status, 200);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
