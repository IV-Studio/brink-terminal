import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGameModule } from './helpers/load-game-module.mjs';

const keys = loadGameModule('src/js/content/Items/itemKeys.ts');
const enemies = loadGameModule('src/js/content/Combat/enemyIds.ts');
const { createMapTileData } = loadGameModule('src/js/content/Map/tileDefinitions.ts', {
  '../Items/itemKeys': keys, '../Combat/enemyIds': enemies,
});
const { mapTilesets } = loadGameModule('src/js/content/Map/mapData.ts', {
  '../Combat/enemyIds': enemies,
});

function scenario() {
  const events = [];
  const state = { clearance: 2, tile: { scanned: false }, keywords: new Set() };
  const tiles = createMapTileData({
    enterStation: id => events.push(['station', id]),
    scanCurrentTile: () => { state.tile.scanned = true; events.push(['scan']); },
    getCurrentTile: () => state.tile,
    exitWorld: () => events.push(['exit']),
    onDock: () => events.push(['dock']),
    getClearanceLevel: () => state.clearance,
    changeRoomState: id => events.push(['room', id]),
    checkForKeyword: keyword => state.keywords.has(keyword),
  });
  const action = (id, command) => {
    const match = tiles[id].actions?.find(action => action.command(command));
    assert.ok(match, `Tile ${id} must support ${command}`);
    return match;
  };
  return { tiles, events, state, action };
}

test('tile content can be created before runtime services are ready', () => {
  const notReady = new Proxy({}, { get() { throw Error('Runtime accessed during content creation'); } });
  assert.equal(Object.keys(createMapTileData(notReady)).length, 39);
});

test('every map tile has content and valid loot/enemy identifiers', () => {
  const { tiles } = scenario();
  const itemIds = new Set(Object.values(keys.ItemKeys));
  const enemyIds = new Set(Object.values(enemies.EnemyId));
  for (const tileset of mapTilesets) {
    for (const row of tileset.mapTiles) for (const id of row) assert.ok(tiles[id], `${tileset.id}: missing tile ${id}`);
  }
  for (const tile of Object.values(tiles)) {
    for (const id of tile.loot) assert.ok(itemIds.has(id), `${tile.name}: unknown loot ${id}`);
    if (tile.enemyToSpawn) assert.ok(enemyIds.has(tile.enemyToSpawn), `${tile.name}: unknown enemy`);
    assert.ok(tile.lootSpawnChance >= 0 && tile.lootSpawnChance <= 1);
    assert.ok(Number.isInteger(tile.lootQuantity) && tile.lootQuantity >= 0);
  }
});

test('station docking retains scan and clearance gates and service order', () => {
  for (const [id, station] of [[100, 'reiner-station'], [101, 'leppik-station'], [102, 'kaos-station'], [103, 'queens-port']]) {
    const { state, action, events } = scenario();
    const dock = action(id, 'dock');
    if (id === 100) assert.equal(dock.available(), true);
    else {
      assert.equal(dock.available(), false);
      const scan = action(id, 'scan');
      assert.equal(scan.available(), true);
      scan.action('scan');
      assert.equal(dock.available(), true);
      state.tile = null;
      assert.equal(dock.available(), false);
      state.clearance = 4;
      assert.equal(dock.available(), true);
      assert.equal(scan.available(), false);
      events.length = 0;
    }
    dock.action('dock');
    assert.deepEqual(events, [['station', station], ['exit'], ['dock']]);
  }
});

test('story routes require a scan, enter the correct room, and leave exploration', () => {
  const routes = [
    [201, 'dock', 'derelict-ship'], [202, 'tether', 'unknown-probe'],
    [203, 'land', 'VEP-H5'], [204, 'tether', 'komek-wreckage'],
    [205, 'board', 'moro-mada-ship'], [210, 'load', 'my-cargo-hold'],
    [211, 'comms', 'magnomi-warship'], [212, 'land', 'hidden-base'],
    [213, 'dock', 'sorelia-waystation-1'], [214, 'dock', 'sorelia'],
    [215, 'dock', 'sorelia-waystation-2'], [216, 'cargo', 'my-cargo-hold'],
    [217, 'tether', 'data-vault'],
  ];
  for (const [id, command, room] of routes) {
    const { state, action, events } = scenario();
    const route = action(id, command);
    assert.equal(route.available(), false, room);
    action(id, 'scan').action('scan');
    assert.equal(route.available(), true, room);
    events.length = 0;
    route.action(command);
    assert.deepEqual(events, [['room', room], ['exit']]);
    state.tile = null;
    assert.equal(route.available(), false, room);
  }
});

test('story completion and clearance changes are read when commands are evaluated', () => {
  const { state, action } = scenario();
  state.tile.scanned = true;
  const landing = action(203, 'land');
  assert.equal(landing.available(), true);
  state.clearance = 3;
  assert.equal(landing.available(), false);
  for (const [id, command, keyword] of [[210, 'load', 'reveal'], [211, 'comms', 'crumpled'], [212, 'land', 'good-game']]) {
    const route = action(id, command);
    assert.equal(route.available(), true);
    const before = action(id, 'scan').response();
    state.keywords.add(keyword);
    assert.equal(route.available(), false);
    assert.notEqual(action(id, 'scan').response(), before);
  }
});
