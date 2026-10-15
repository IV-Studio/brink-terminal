import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, apiErrorMessage } from '../src/js/api.js';

const gameResponse = { username: 'test-player', clearanceLevel: 0, keywords: [], terminalMessages: [], rooms: {}, characters: {}, files: {}, characterFiles: {}, messages: {} };

test('API client sends raw JSON commands and preserves authored response markup', async () => {
  const calls = [];
  const client = createApiClient({ baseUrl: 'https://example.test', fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return new Response(url.endsWith('/respond') ? JSON.stringify({ ...gameResponse, terminalMessages: ['<h>Story</h><br>'] }) : 'ok');
  } });
  assert.equal(await client.health(), 'ok');
  const command = { command: '<test> & $&', context: 'username' };
  assert.deepEqual((await client.respond(command)).terminalMessages, ['<h>Story</h><br>']);
  assert.equal(await client.combat(command), 'ok');
  assert.deepEqual(calls.map(call => [call.url, call.options.method]), [
    ['https://example.test/api/hello', 'GET'], ['https://example.test/api/respond', 'POST'], ['https://example.test/api/combat', 'POST'],
  ]);
  assert.deepEqual(JSON.parse(calls[1].options.body), command);
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json');
});

test('HTTP and network failures have controlled user messages and no retries', async () => {
  let calls = 0;
  const client = createApiClient({ fetchImpl: async () => { calls++; return new Response('private error details', { status: 503 }); } });
  await assert.rejects(client.respond({ command: 'test' }), error => error.kind === 'http' && error.status === 503 && !apiErrorMessage(error).includes('private'));
  assert.equal(calls, 1);
  const offline = createApiClient({ fetchImpl: async () => { throw new TypeError('private network details'); } });
  await assert.rejects(offline.health(), error => error.kind === 'network' && apiErrorMessage(error).includes('Check your connection'));
});

for (const phase of ['headers', 'body']) {
  test(`timeout aborts a stalled response during ${phase}`, async () => {
    let signal;
    const client = createApiClient({ timeoutMs: 10, fetchImpl: async (_, options) => {
      signal = options.signal;
      if (phase === 'headers') return new Promise(() => {});
      return { ok: true, text: () => new Promise(() => {}) };
    } });
    await assert.rejects(client.health(), error => error.kind === 'timeout' && apiErrorMessage(error).includes('timed out'));
    assert.equal(signal.aborted, true);
  });
}

test('invalid JSON and malformed response envelopes are rejected before state changes', async () => {
  for (const body of ['not json', '[]', '{}', JSON.stringify({ ...gameResponse, terminalMessages: ['ok', {}] }), JSON.stringify({ ...gameResponse, keywords: 'wrong' }), JSON.stringify({ ...gameResponse, rooms: [] })]) {
    const client = createApiClient({ fetchImpl: async () => new Response(body) });
    await assert.rejects(client.respond({ command: 'test' }), error => error.kind === 'invalid-response');
  }
});
