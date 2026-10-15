const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_URL = 'postgres://localhost/test';
const { createLogger } = require('../logging');

const command = {
  username: 'test-player', command: 'test-enemy', context: 'world',
  keywords: ['test'], clearanceLevel: 3, character: 'pilot', room: 'dock', station: 'station',
};

test('command and combat logs retain their intended context and fields', async () => {
  const queries = [];
  const database = { query: async (sql, values) => { queries.push({ sql, values }); return { rows: [{ id: queries.length }] }; } };
  const logger = createLogger(database);
  assert.deepEqual(await logger.logCommand(command), { id: 1 });
  assert.deepEqual(await logger.logCombat(command), { id: 2 });
  assert.deepEqual(queries[0].values, ['test-player', 'test-enemy', 'world', ['test'], 3, 'pilot', 'dock', 'station']);
  assert.deepEqual(queries[1].values, ['test-player', 'test-enemy', 'kill', ['test'], 3, '', '', '']);
  assert.match(queries[1].sql, /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\)/);
});

test('failed command and combat inserts are handled without rejecting callers', async () => {
  const failure = Object.assign(new Error('private database details'), { code: '08006' });
  const reported = [];
  const logger = createLogger({ query: async () => { throw failure; } }, (...args) => reported.push(args));
  assert.equal(await logger.logCommand(command), null);
  assert.equal(await logger.logCombat(command), null);
  assert.deepEqual(reported, [['Command logging failed', '08006'], ['Command logging failed', '08006']]);
});

test('log-read errors propagate to the route without referencing an Express response', async () => {
  const failure = new Error('database unavailable');
  const logger = createLogger({ query: async () => { throw failure; } });
  await assert.rejects(logger.getInfo(), error => error === failure);
});

test('database outages return HTTP 500 for logs while gameplay requests still complete', async t => {
  const { createApp } = require('../server');
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD = 'test-password';
  t.mock.method(console, 'error', () => {});
  const failures = [];
  const logger = createLogger({ query: async () => { throw new Error('database unavailable'); } }, (...args) => failures.push(args));
  const server = createApp(logger).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const logs = await fetch(base + '/api/command-logs', {
      headers: { Authorization: 'Basic ' + Buffer.from('test-admin:test-password').toString('base64') },
    });
    assert.equal(logs.status, 500);
    assert.equal(await logs.text(), 'An error occurred while fetching command logs');
    for (const [path, body] of [
      ['/api/respond', { command: 'test-player', context: 'username', keywords: [] }],
      ['/api/combat', command],
    ]) {
      const response = await fetch(base + path, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      assert.equal(response.status, 200);
    }
    assert.equal(failures.length, 2);
    assert.equal((await fetch(base + '/api/hello')).status, 200);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
