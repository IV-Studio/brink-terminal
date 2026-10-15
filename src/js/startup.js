import Command from './command.js';
import Actions from './actions.js';
import Station from './content/station.js';
import Clearance from './content/clearance.js';
import getSMInstance from './statemanager.js';
import Username from './content/username.js';
import Keywords from './content/keywords.js';
import ConnectionError from './content/connectionError.js';
import Messages from './content/messages.js';
import { api } from './api.js';
import { initializeContext } from './context.js';
import { startTerminalEffects } from './effects.js';
import { initializeCredits } from './content/Player/credits';
import { initializePlayerShip, playerShip } from './content/Ship/ships';
import { configureShipPresentation } from './content/Ship/shipBase';
import { initializeWorld } from './content/Map/world';
import { initializeCombat } from './content/Combat/combat';
import { initializeArmory } from './content/Stores/armory';
import { initializeSupplyDepot } from './content/Stores/supplyDepot';
import { initializeRiveUI, enableRiveKeyboard } from './rive.js';
import * as animations from './riveMap';

let startup;
export function startApplication() {
  return startup ??= initializeApplication();
}

async function initializeApplication() {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  const state = getSMInstance();
  window.stateManager = state;
  initializeContext(window.location.pathname);
  state.setup();
  configureShipPresentation({
    command: Command,
    animations,
    getClearance: () => Clearance.getClearanceLevel(),
    getPlayerAttack: () => playerShip.attackLevels[playerShip.attackLevel].amount,
  });
  initializeCredits();
  initializePlayerShip();
  initializeWorld();
  initializeCombat();
  initializeArmory();
  initializeSupplyDepot();
  Keywords.init();
  Clearance.setClearanceLevel(-1);
  Station.init();
  Username.init();
  Messages.init();
  // Interactive states cannot run until their animation inputs exist.
  await withTimeout(Promise.all([initializeRiveUI(), animations.initializeRiveMap()]), 30000);
  startTerminalEffects();
  let initialState = Username.Actions.state;
  try {
    await api.health();
  } catch (error) {
    console.error('Server connection failed', error);
    initialState = ConnectionError.Actions.state;
  }
  // changeActionState already renders actions and queues the entry message.
  Actions.changeActionState(initialState);
  Command.responseText();
  Command.init();
  enableRiveKeyboard();
}

function withTimeout(promise, milliseconds) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Animations timed out')), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}
