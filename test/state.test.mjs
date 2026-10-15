import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

let counter = 0;
async function freshState() {
  const source = await readFile(new URL('../src/js/statemanager.js', import.meta.url), 'utf8');
  const { default: getState } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64') + '#' + counter++);
  return getState();
}

test('nested writes preserve sibling values and object identity', async () => {
  const state = await freshState();
  state.set('ship.inventory.capacity', 10);
  const inventory = state.get('ship.inventory');
  state.set('ship.inventory.items', ['water']);
  state.set('ship.inventory.capacity', 12);
  assert.equal(state.get('ship.inventory'), inventory);
  assert.deepEqual(inventory, { capacity: 12, items: ['water'] });
});

test('root keys do not interfere with equally named nested keys', async () => {
  const state = await freshState();
  state.set('inventory', { unrelated: true });
  state.set('ship.inventory.capacity', 10);
  assert.equal(state.get('ship.inventory.capacity'), 10);
  assert.deepEqual(state.get('inventory'), { unrelated: true });
});

test('nested numeric updates and removal preserve adjacent state', async () => {
  const state = await freshState();
  state.set('game.progress.credits', 2);
  state.set('game.progress.chapter', 3);
  state.add('game.progress.credits', 4);
  state.remove('game.progress.chapter');
  assert.deepEqual(state.get('game.progress'), { credits: 6 });
});
