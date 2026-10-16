import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGameModule } from './helpers/load-game-module.mjs';

function inventoryGame() {
  const state = new Map();
  const messages = [];
  const command = { default: { addCommandResponse: text => messages.push(text) } };
  const sm = { default: () => ({ set: (key, value) => state.set(key, value) }) };
  const credits = loadGameModule('src/js/content/Player/credits.ts', {
    '../../command.js': command, '../../statemanager.js': sm,
  });
  const wallet = credits.initializeCredits();
  const { ItemContainer } = loadGameModule('src/js/content/Items/itemContainer.ts', {
    '../../command': command, '../../statemanager.js': sm, '../Player/credits': credits,
  });
  const water = { id: 'water', name: 'Water', command: ['water'], purchasePrice: 2, sellPrice: 1 };
  return { ItemContainer, wallet, state, messages, water };
}

test('inventory transfers conserve stock and reject unavailable stock or full destinations', () => {
  const { ItemContainer, water } = inventoryGame();
  const source = new ItemContainer();
  const target = new ItemContainer(3);
  source.addItem(water, 5);
  source.transferItems(source, target, 'take', 'take 2 water');
  assert.equal(source.getItemQuantity(water), 3);
  assert.equal(target.getItemQuantity(water), 2);
  for (const command of ['take 4 water', 'take 2 water', 'take nope water', 'take 1 unknown', 'take -1 water', 'take 0 water', 'take 1x water']) {
    source.transferItems(source, target, 'take', command);
    assert.equal(source.getItemQuantity(water), 3, command);
    assert.equal(target.getItemQuantity(water), 2, command);
  }
  source.transferItems(source, target, 'take', 'take 1 water');
  assert.equal(target.getSpaceRemaining(), 0);
  assert.equal(source.getTotalQuantity() + target.getTotalQuantity(), 5);
});

test('bulk transfer leaves stock behind when a destination cannot fit it', () => {
  const { ItemContainer, water } = inventoryGame();
  const source = new ItemContainer();
  const target = new ItemContainer(2);
  source.addItem(water, 3);
  source.transferAllItems(source, target);
  assert.equal(source.getItemQuantity(water), 3);
  assert.equal(target.getTotalQuantity(), 0);
  source.removeItem(water);
  source.transferAllItems(source, target);
  assert.equal(source.getTotalQuantity(), 0);
  assert.equal(target.getItemQuantity(water), 2);
});

test('purchases and sales update stock, wallet, and saved credits exactly once', () => {
  const { ItemContainer, wallet, state, water } = inventoryGame();
  const store = new ItemContainer();
  const cargo = new ItemContainer(2);
  store.addItem(water, 4);
  wallet.gain(4); // Six credits.
  store.buyItems(store, cargo, 'buy', 'buy 2 water');
  assert.equal(store.getItemQuantity(water), 2);
  assert.equal(cargo.getItemQuantity(water), 2);
  assert.equal(wallet.getAmount(), 2);
  assert.equal(state.get('game.credits'), 2);
  cargo.sellItems(cargo, 'sell', 'sell 1 water');
  assert.equal(cargo.getItemQuantity(water), 1);
  assert.equal(wallet.getAmount(), 3);
  cargo.sellAllItems(cargo);
  assert.equal(cargo.getTotalQuantity(), 0);
  assert.equal(wallet.getAmount(), 4);
  assert.equal(state.get('game.credits'), 4);
});

test('failed purchases preserve inventory and credits', () => {
  const { ItemContainer, wallet, water } = inventoryGame();
  const store = new ItemContainer();
  const cargo = new ItemContainer(1);
  store.addItem(water, 4);
  for (const command of ['buy 2 water', 'buy 5 water', 'buy nope water', 'buy 1 unknown', 'buy -1 water', 'buy 0 water', 'buy 1x water']) {
    store.buyItems(store, cargo, 'buy', command);
    assert.equal(wallet.getAmount(), 2, command);
    assert.equal(store.getItemQuantity(water), 4, command);
    assert.equal(cargo.getTotalQuantity(), 0, command);
  }
  cargo.addItem(water);
  store.buyItems(store, cargo, 'buy', 'buy 1 water');
  assert.equal(wallet.getAmount(), 2);
  assert.equal(store.getItemQuantity(water), 4);
  assert.equal(cargo.getItemQuantity(water), 1);
});

test('selling and ejecting reject nonpositive, fractional, or malformed quantities', () => {
  const { ItemContainer, wallet, state, water } = inventoryGame();
  const cargo = new ItemContainer();
  cargo.addItem(water, 3);
  for (const quantity of ['-1', '0', '1.5', '1x', 'NaN', 'Infinity', '9007199254740992']) {
    cargo.sellItems(cargo, 'sell', 'sell ' + quantity + ' water');
    cargo.eject('eject', 'eject ' + quantity + ' water');
    assert.equal(cargo.getItemQuantity(water), 3, quantity);
    assert.equal(wallet.getAmount(), 2, quantity);
    assert.equal(state.get('game.credits'), 2, quantity);
  }
  cargo.eject('eject', 'eject 1 water');
  assert.equal(cargo.getItemQuantity(water), 2);
});

test('credits reject invalid spending and reset saved balance on death', () => {
  const { wallet, state } = inventoryGame();
  for (const amount of [-1, 0, 3]) wallet.spend(amount);
  wallet.gain(0);
  wallet.gain(-1);
  assert.equal(wallet.getAmount(), 2);
  assert.equal(state.get('game.credits'), 2);
  wallet.onDeath();
  assert.equal(wallet.getAmount(), 0);
  assert.equal(state.get('game.credits'), 0);
});

function combatGame() {
  const { Ship, configureShipPresentation } = loadGameModule('src/js/content/Ship/shipBase.ts');
  const { AttackAction } = loadGameModule('src/js/content/Combat/combatActions.ts');
  const animations = new Proxy({}, { get: () => ({ value: 0 }) });
  configureShipPresentation({ command: { addCommandResponse() {} }, animations, getClearance: () => 0, getPlayerAttack: () => 1 });
  class Target extends Ship {
    name = 'Test target'; currentHealth = 10; currentShield = 3;
    temporaryEvadeChance = 0; deaths = 0;
    getMaxHealth() { return 10; }
    getMaxShield() { return 3; }
    death() { this.deaths++; }
  }
  return { target: new Target(), AttackAction };
}

test('combat absorbs hits with shields, applies overflow, and clamps lethal damage', t => {
  const { target, AttackAction } = combatGame();
  t.mock.method(Math, 'random', () => 0.5);
  target.attack(new AttackAction({ damageAmount: 2 }));
  assert.equal(target.currentShield, 1);
  assert.equal(target.currentHealth, 10);
  target.attack(new AttackAction({ damageAmount: 2, damageMultiplier: 2 }));
  assert.equal(target.currentShield, 0);
  assert.equal(target.currentHealth, 7);
  target.attack(new AttackAction({ damageAmount: 20 }));
  assert.equal(target.currentHealth, 0);
  assert.equal(target.deaths, 1);
});

test('misses and evasion preserve health and shields; repairs stop at maximum', t => {
  const { target, AttackAction } = combatGame();
  t.mock.method(Math, 'random', () => 0.5);
  target.attack(new AttackAction({ damageAmount: 10, hitPercentageChance: 0 }));
  target.temporaryEvadeChance = 1;
  target.attack(new AttackAction({ damageAmount: 10 }));
  assert.equal(target.currentHealth, 10);
  assert.equal(target.currentShield, 3);
  target.currentHealth = 2;
  target.modifyHealth(20);
  target.modifyShields(20);
  assert.equal(target.currentHealth, 10);
  assert.equal(target.currentShield, 3);
});
