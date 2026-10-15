import Command from "../../command";
import { Enemy } from "../Combat/enemies";
import { Item } from "../Items/items";
import { ItemData } from "../Items/itemList";
import { playerShip } from "../Ship/ships";
import { Ship } from "../Ship/shipBase";
import { AttackAction } from "../Combat/combatActions";
import { playerCredits } from "../Player/credits";


export interface ShipPartData extends ItemData {
  faction: string;

  qualityLevel: number;
  enemyLoot: boolean;

  onAttackAction?: (attackAction: AttackAction, ship: Ship, enemy: Enemy) => AttackAction;
  onReactorAction?: (ship: Ship) => void;
  onShieldAction?: (ship: Ship) => void;
  onThrusterAction?: (ship: Ship) => void;
  onEscapeAction?: () => void;

  onTakeDamageAction?: () => void;
  onShieldLossAction?: () => void;

  onMoveAction?: (ship: Ship) => void;

  onCombatBegin?: () => void;
  onCombatEnd?: () => void;

  onTurnBegin?: () => void;
  onTurnEnd?: () => void;
  
  healthAmount?: () => number;
  storageAmount?: () => number;
  reactorAmount?: () => number;
  shieldAmount?: () => number;
  evadeChance?: () => number;
  escapeChance?: () => number;

}

export function shipPartsTitle() {
  return 'Ship Parts <span class="float-right">' + playerShip.shipPartContainer.getTotalQuantity() + ' / ' + playerShip.shipPartContainer.capacity + '</span>';
};

export class ShipPart extends Item {
  shipPartData: ShipPartData;

  constructor(shipPartData: ShipPartData) {
    super(shipPartData);
    this.shipPartData = shipPartData;
  }

  
}

export enum Factions {
  KOMEK = "Komek",
  VENTUS = "Ventus",
  MAGNOMI = "Magnomi",
  HENKO = "Henko",
  SORELIA = "Sorelia",
  UTOPIAN_ALLIANCE = "Utopian Alliance",
}

export enum ShipPartKeys {
  DEFENDER_9000 = "DEFENDER_9000",
  DUO_1000 = "DUO_1000",
  PRECARI_4050 = "PRECARI_4050",
  SIPHON = "SIPHON",
  TITAN_3000 = "TITAN_3000",
  SYMBIOTE_9000 = "SYMBIOTE_9000",
  ACCELERATOR_MK3 = "ACCELERATOR_MK3",
  CATALYZER_MK2 = "CATALYZER_MK2",
  DABURU_MK1 = "DABURU_MK1",
  DARK_MATTER_MK3 = "DARK_MATTER_MK3",
  EMULATOR_MK2 = "EMULATOR_MK2",
  INVERTER_MK2 = "INVERTER_MK2",
  PULSOR_MK1 = "PULSOR_MK1",
  SAPPHIRE_MK2 = "SAPPHIRE_MK2",
  MG_CHARGE_CORE = "MG_CHARGE_CORE",
  MG_IO_CHARGE = "MG_IO_CHARGE",
  MG_IO_CORE = "MG_IO_CORE",
  MG_OVERCHARGER = "MG_OVERCHARGER",
  MG_RAID = "MG_RAID",
  MG_REFORMER = "MG_REFORMER",
  MG_UPGRADE_CORE = "MG_UPGRADE_CORE",
  MG1_KINETIC = "MG1_KINETIC",
  MG1_RAILGUN = "MG1_RAILGUN",
  MG2_LASER_TURRETS = "MG2_LASER_TURRETS",
  MG2_QUAD_LASER = "MG2_QUAD_LASER",
  PHOTON_CANNON = "PHOTON_CANNON",
  SHARD_SPEAR = "SHARD_SPEAR",
  ABSORPTION_K2 = "ABSORPTION_K2",
  ESCAPE_JETS_E1 = "ESCAPE_JETS_E1",
  HYPERSHIFT = "HYPERSHIFT",
  INJECTOR_T9 = "INJECTOR_T9",
  IO_EXHAUST_E1 = "IO_EXHAUST_E1",
  IO_PIVOT_H2 = "IO_PIVOT_H2",
  IO_SURGE_E2 = "IO_SURGE_E2",
  JUMP_JETS_E2 = "JUMP_JETS_E2",
  MULTI_STAGE_M1 = "MULTI_STAGE_M1",
  STAGED_BURST_E3 = "STAGED_BURST_E3",
  THRUST_TUNER_E2 = "THRUST_TUNER_E2",
  TWIN_JETS_E4 = "TWIN_JETS_E4",
  TWIN_PROBE_E2 = "TWIN_PROBE_E2",
  VECTOR_JETS_E3 = "VECTOR_JETS_E3",
}

export const shipPartList: { [key: string]: ShipPartData } = {
  // REACTORS
  [ShipPartKeys.CATALYZER_MK2]: {
    id: ShipPartKeys.CATALYZER_MK2,
    name: 'Catalyzer Mk2',
    faction: Factions.KOMEK,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['catalyzer', 'catalyzer mk2'],
    description: "60% change to gain +1 Reactor on moving. Reactor action charges +1 Reactor.",
    sellPrice: 3,
    purchasePrice: 5,
    onMoveAction(ship: Ship) {
      console.log('running on Move Action');
      if (Math.random() < 0.6) {
        playerShip.modifyReactor(1);
      }
    },
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 1);
      playerShip.modifyReactor(1);
    },
  },
  [ShipPartKeys.ACCELERATOR_MK3]: {
    id: ShipPartKeys.ACCELERATOR_MK3,
    name: 'Accelerator mk3',
    faction: Factions.KOMEK,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['accelerator', 'accelerator mk3'],
    description: "Reactor action charges +3 Reactor.",
    sellPrice: 3,
    purchasePrice: 5,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 3);
      playerShip.modifyReactor(3);
    },
  },
  [ShipPartKeys.DABURU_MK1]: {
    id: ShipPartKeys.DABURU_MK1,
    name: 'Daburu Mk1',
    faction: Factions.KOMEK,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['daburu', 'daburu mk1'],
    description: "+2 base Reactor. Reactor action charges +2.",
    sellPrice: 3,
    purchasePrice: 5,
    reactorAmount() {
      return 2;
    },
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 3);
      playerShip.modifyReactor(2);
    },
  },
  [ShipPartKeys.MG_CHARGE_CORE]: {
    id: ShipPartKeys.MG_CHARGE_CORE,
    name: 'MG Charge Core',
    faction: Factions.MAGNOMI,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['charge core', 'mg charge core'],
    description: "50% chance to add 3 Damage to attacks and spend -1 Reactor. Reactor action charges +2.",
    sellPrice: 3,
    purchasePrice: 5,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 2);
      playerShip.modifyReactor(2);
    },
    onAttackAction(attackAction, ship, enemy) {

      if (Math.random() < 0.5) {
        Command.addCommandResponse('Dark Matter mk3 added 3 Damage to attack. -1 Reactor.');
        attackAction.damageAmount += 3;
        playerShip.modifyReactor(-1);
      }
      return attackAction;
    },
  },
  [ShipPartKeys.EMULATOR_MK2]: {
    id: ShipPartKeys.EMULATOR_MK2,
    name: 'Emulator Mk2',
    faction: Factions.KOMEK,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['emulator', 'emulator mk2'],
    description: "+2 Shields. Reactor action charges +2 and recharges +1 Shield.",
    sellPrice: 3,
    purchasePrice: 5,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 2);
      playerShip.modifyReactor(2);
      playerShip.modifyShields(1);
    },
    shieldAmount() {
      return 2;
    },
  },
  [ShipPartKeys.INVERTER_MK2]: {
    id: ShipPartKeys.INVERTER_MK2,
    name: 'Inverter Mk2',
    faction: Factions.KOMEK,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['inverter', 'inverter mk2'],
    description: "+2 Reactor. On Reactor action, fully recharge Reactor and lose -1 Health, ",
    sellPrice: 4,
    purchasePrice: 6,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor fully recharging');
      playerShip.modifyReactor(100);
      playerShip.modifyHealth(-1);
    },
    reactorAmount() {
      return 2;
    },
  },
  [ShipPartKeys.PULSOR_MK1]: {
    id: ShipPartKeys.PULSOR_MK1,
    name: 'Pulsor Mk1',
    faction: Factions.KOMEK,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['pulsor', 'pulsor mk1'],
    description: "+2 Reactor. On Reactor action, charge Reactor +2",
    sellPrice: 2,
    purchasePrice: 3,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 2);
      playerShip.modifyReactor(2);
    },
    reactorAmount() {
      return 2;
    },
  },
  [ShipPartKeys.SAPPHIRE_MK2]: {
    id: ShipPartKeys.SAPPHIRE_MK2,
    name: 'Sapphire Mk2',
    faction: Factions.KOMEK,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['sapphire', 'sapphire mk2'],
    description: "+4 Reactor. Reactor action recharges Reactor +2.",
    sellPrice: 4,
    purchasePrice: 6,
    onReactorAction(ship: Ship) {
      Command.addCommandResponse('Reactor charging ' + 2);
      playerShip.modifyReactor(2);
    },
    reactorAmount() {
      return 4;
    },
  },
  // SHIELDS
  [ShipPartKeys.DEFENDER_9000]: {
    id: ShipPartKeys.DEFENDER_9000,
    name: 'Defender 9000',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['defender 3000', 'defender'],
    description: "+3 Shields. Shield Action fully recharges shields, costs -1 Reactor.",
    sellPrice: 2,
    purchasePrice: 4,
    shieldAmount: () => 3,
    onShieldAction(ship: Ship) {
      if (playerShip.currentReactor > 1) {
        Command.addCommandResponse(this.name +' recharging shields.');
        playerShip.modifyReactor(-1);
        playerShip.rechargeShields();
      } else {
        Command.addCommandResponse(this.name +' could not recharge shields due to lack of reactor power.');
      }
      playerShip.modifyShields(1);
    },
  },
  [ShipPartKeys.DUO_1000]: {
    id: ShipPartKeys.DUO_1000,
    name: 'Duo 3000',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['duo 3000', 'duo'],
    description: "+2 Shields. On damage taken, 30% chance to fully recharge shields. Shield action recharges +1 Shield.",
    sellPrice: 1,
    purchasePrice: 3,
    shieldAmount: () => 2,
    onShieldAction() {
      playerShip.modifyShields(1);
    },
    onTakeDamageAction() {
      if (Math.random() < 0.3) {
        Command.addCommandResponse(this.name +' recharging shields.');
        playerShip.rechargeShields();
      }
    },
  },
  [ShipPartKeys.PRECARI_4050]: {
    id: ShipPartKeys.PRECARI_4050,
    name: 'Precari 4050',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['precari 4050', 'precari'],
    description: "+4 Shields. When shield blocks any damage, 30% chance to gain 1 Credit. Shield action recharges +1 Shield.",
    sellPrice: 3,
    purchasePrice: 5,
    shieldAmount: () => 4,
    onShieldAction() {
      playerShip.modifyShields(1);
    },
    onShieldLossAction() {
      if (Math.random() < 0.3) {
        Command.addCommandResponse(this.name +' stole a credit from the enemy.');
        playerCredits.gain(1);
      }
    },
  },
  [ShipPartKeys.SIPHON]: {
    id: ShipPartKeys.SIPHON,
    name: 'Siphon',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['siphon'],
    description: "+2 Shields. When shield blocks any damage, 30% chance to gain +1 Reactor. Shield action recharges +1 Shield.",
    sellPrice: 3,
    purchasePrice: 5,
    shieldAmount: () => 2,
    onShieldAction() {
      playerShip.modifyShields(1);
    },
    onShieldLossAction() {
      if (Math.random() < 0.3) {
        Command.addCommandResponse(this.name +' stole +1 Reactor power from the enemy.');
        playerShip.modifyReactor(1);
      }
    },
  },
  [ShipPartKeys.TITAN_3000]: {
    id: ShipPartKeys.TITAN_3000,
    name: 'Titan 3000',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['titan 3000', 'titan'],
    description: "+4 Shields. Shield action recharges +2 Shield.",
    sellPrice: 4,
    purchasePrice: 6,
    shieldAmount: () => 4,
    onShieldAction() {
      playerShip.modifyShields(2);
    },
  },
  [ShipPartKeys.SYMBIOTE_9000]: {
    id: ShipPartKeys.SYMBIOTE_9000,
    name: 'Symbiote 9000',
    faction: Factions.HENKO,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['symbiote', 'symbiote 9000'],
    description: "+2 Shields. 40% chance to recharge +1 Shield when attacked. Shield action recharges +1 Shield.",
    sellPrice: 4,
    purchasePrice: 2,
    shieldAmount: () => 2,
    onShieldAction() {
      playerShip.modifyShields(1);
    },
    onTakeDamageAction () {
      if (Math.random() < 0.4) {
        Command.addCommandResponse(this.name +' is recharging +1 Shield.');
        playerShip.modifyShields(1);
      }
    },
    onShieldLossAction () {
      if (Math.random() < 0.4) {
        Command.addCommandResponse(this.name +' is recharging +1 Shield.');
        playerShip.modifyShields(1);
      }
    }
  },
  // WEAPONS
  [ShipPartKeys.MG_IO_CHARGE]: {
    id: ShipPartKeys.MG_IO_CHARGE,
    name: 'MG IO Charge',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg io charge', 'io charge'],
    description: "+1 Damage. If your health is 2 or less, x2 damage multiplier.",
    sellPrice: 2,
    purchasePrice: 4,
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 1;
      if (playerShip.currentHealth <= 2) {
        Command.addCommandResponse('Low health. x2 damage multiplier.');
        attackAction.damageMultiplier += 2;
      }
      return attackAction;
    },
  },
  [ShipPartKeys.MG_IO_CORE]: {
    id: ShipPartKeys.MG_IO_CORE,
    name: 'MG IO Core',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg io core', 'io core'],
    description: "-1 Damage. 1.5x damage multiplier.",
    sellPrice: 1,
    purchasePrice: 2,
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount -= 1;
      attackAction.damageMultiplier += 1.5;
      return attackAction;
    },
  },
  [ShipPartKeys.MG_OVERCHARGER]: {
    id: ShipPartKeys.MG_OVERCHARGER,
    name: 'MG Overcharger',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg overcharger', 'overcharger'],
    description: "On attack, -1 Reactor. 2x damage multiplier.",
    sellPrice: 1,
    purchasePrice: 2,
    onAttackAction(attackAction: AttackAction) {
      playerShip.modifyReactor(-1);
      attackAction.damageMultiplier += 2;
      return attackAction;
    },
  },
  [ShipPartKeys.MG_REFORMER]: {
    id: ShipPartKeys.MG_REFORMER,
    name: 'MG Reformer',
    faction: Factions.MAGNOMI,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['mg reformer', 'reformer'],
    description: "50% chance to lose -1 Health when combat begins. +4 damage.",
    sellPrice: 3,
    purchasePrice: 4,
    onCombatBegin() {
      if (Math.random() < 0.5) {
        Command.addCommandResponse('MG Reformer overheated. -1 Health.')
        playerShip.modifyHealth(-1);
      }
    },
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 4;
      return attackAction;
    },
  },
  [ShipPartKeys.MG_UPGRADE_CORE]: {
    id: ShipPartKeys.MG_UPGRADE_CORE,
    name: 'MG Upgrade Core',
    faction: Factions.MAGNOMI,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['mg upgrade core', 'upgrade core'],
    description: "+1 Damage. 15% chance to add 3x damage multiplier.",
    sellPrice: 3,
    purchasePrice: 4,
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 1;
      if (Math.random() < 0.15) {
        Command.addCommandResponse('MG Upgrade Core critical hit!');
        attackAction.damageMultiplier += 3;
      }
      return attackAction;
    },
  },
  [ShipPartKeys.MG1_KINETIC]: {
    id: ShipPartKeys.MG1_KINETIC,
    name: 'MG1 Kinetic',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg1 kinetic', 'kinetic'],
    description: "+4 Damage. 25% change to lose -1 Health when attacking.",
    sellPrice: 3,
    purchasePrice: 4,
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 4;
      if (Math.random() < 0.25) {
        Command.addCommandResponse('MG1 Kinetic overheated!');
        playerShip.modifyHealth(-1);
      }
      return attackAction;
    },
  },
  [ShipPartKeys.MG1_RAILGUN]: {
    id: ShipPartKeys.MG1_RAILGUN,
    name: 'MG1 Railgun',
    faction: Factions.MAGNOMI,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['mg1 railgun', 'railgun'],
    description: "+3 damage. -2 Shields.",
    sellPrice: 3,
    purchasePrice: 4,
    shieldAmount() {
      return -2;
    },
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 3;
      return attackAction;
    },
  },
  [ShipPartKeys.MG2_LASER_TURRETS]: {
    id: ShipPartKeys.MG2_LASER_TURRETS,
    name: 'MG2 Laser Turrets',
    faction: Factions.MAGNOMI,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['mg2 laser turrets', 'mg2 laser turrets'],
    description: "75% chance to deal +1 Damage. 25% to deal +4 damage.",
    sellPrice: 2,
    purchasePrice: 3,
    onAttackAction(attackAction: AttackAction) {
      if (Math.random() < 0.75) {
        attackAction.damageAmount += 1;
      } else {
        attackAction.damageAmount += 4;
      }
      return attackAction;
    },
  },
  [ShipPartKeys.MG2_QUAD_LASER]: {
    id: ShipPartKeys.MG2_QUAD_LASER,
    name: 'MG2 Quad Laser',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg2 quad laser', 'mg2 quad laser'],
    description: "+2 Damage. +15% Evade Chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.15;
    },
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 2;
      return attackAction;
    },
  },
  [ShipPartKeys.SHARD_SPEAR]: {
    id: ShipPartKeys.SHARD_SPEAR,
    name: 'Shard Spear',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['shard spear'],
    description: "+2 damage",
    sellPrice: 2,
    purchasePrice: 3,
    onAttackAction(attackAction: AttackAction) {
      attackAction.damageAmount += 2;
      return attackAction;
    },
  },
  
  // THRUSTERS
  [ShipPartKeys.ABSORPTION_K2]: {
    id: ShipPartKeys.ABSORPTION_K2,
    name: 'Absorption K2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['absorption', 'absorption k2'],
    description: "Thruster action adds 15% temporary Evade Chance, and +1 Reactor",
    sellPrice: 3,
    purchasePrice: 4,
    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 15% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.15;
      playerShip.modifyReactor(1);
    },
  },
  [ShipPartKeys.ESCAPE_JETS_E1]: {
    id: ShipPartKeys.ESCAPE_JETS_E1,
    name: 'Escape Jets E1',
    faction: Factions.VENTUS,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['escape jets', 'escape jets e1'],
    description: "+40% Escape Chance. +10% Evade chance. On escape attampt, 25% to gain +1 Health.",
    sellPrice: 3,
    purchasePrice: 4,
    escapeChance() {
      return .4;
    },
    evadeChance() {
      return .1;
    },
    onEscapeAction() {
      if (Math.random() < 0.25) {
        playerShip.modifyHealth(1);
      }
      
    }
  },
  [ShipPartKeys.HYPERSHIFT]: {
    id: ShipPartKeys.HYPERSHIFT,
    name: 'Hypershift',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['hypershift'],
    description: "Start combat with +40% Temporary Evade Chance.",
    sellPrice: 3,
    purchasePrice: 4,
    onCombatBegin() {
      Command.addCommandResponse('Gained 40% temporary evade chance. This will decay ' + playerShip.evasionLoss*100 + '% each turn');
      playerShip.temporaryEvadeChance += 0.4;
    },
  },
  [ShipPartKeys.INJECTOR_T9]: {
    id: ShipPartKeys.INJECTOR_T9,
    name: 'Injector T9',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['injector', 'injector t9'],
    description: "-15% Evade Chance. Start combat with +80% Temporary Evade Chance.",
    sellPrice: 3,
    purchasePrice: 4,

    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 25% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.25;
      playerShip.modifyReactor(1);
    },
  },
  [ShipPartKeys.IO_EXHAUST_E1]: {
    id: ShipPartKeys.IO_EXHAUST_E1,
    name: 'IO Exhaust E1',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['io exhaust e1', 'io exhaust', 'exhaust e1'],
    description: "Thruster action adds +25% Temporary Evade Chance and spends -1 Reactor.",
    sellPrice: 1,
    purchasePrice: 2,
    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 25% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.25;
      playerShip.modifyReactor(-1);
    },
  },
  [ShipPartKeys.IO_PIVOT_H2]: {
    id: ShipPartKeys.IO_PIVOT_H2,
    name: 'IO Pivot H2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['io pivot h2', 'io pivot', 'pivot h2'],
    description: "When you have 2 or less health, +35% evade chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      if (playerShip.currentHealth <= 2) {
        return 0.35;
      } else {
        return 0;
      }
    },
  },
  [ShipPartKeys.IO_SURGE_E2]: {
    id: ShipPartKeys.IO_SURGE_E2,
    name: 'IO Surge E2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['io surge e2', 'io surge', 'surge e2'],
    description: "+10% Evade Chance. On Thruster action, 50% chance to add 80% Temporary Evade Chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.1;
    },
    onThrusterAction(ship: Ship) {
      if (Math.random() < 0.5) {
        Command.addCommandResponse('Gained 25% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
        ship.temporaryEvadeChance += 0.8;
      }
    },
  },
  [ShipPartKeys.JUMP_JETS_E2]: {
    id: ShipPartKeys.JUMP_JETS_E2,
    name: 'Jump Jets E2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['jump jets e2', 'jump jets'],
    description: "+15% Evade Chance. On Thruster action, add 15% Temporary Evade Chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.15;
    },
    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 15% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.15;
    },
  },
  [ShipPartKeys.MULTI_STAGE_M1]: {
    id: ShipPartKeys.MULTI_STAGE_M1,
    name: 'Multi Stage M1',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['multi stage m1', 'jump jets'],
    description: "+15% Evade Chance. On Thruster action, -1 Health and 40% Temporary Evade Chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.15;
    },
    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 40% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.40;
      playerShip.modifyHealth(-1);
    },
  },
  [ShipPartKeys.STAGED_BURST_E3]: {
    id: ShipPartKeys.STAGED_BURST_E3,
    name: 'Staged Burst E3',
    faction: Factions.VENTUS,
    qualityLevel: 1,
    enemyLoot: true,
    command: ['staged burst e3', 'staged burst'],
    description: "+15% Evade Chance. On Thruster action, -1 Reactor and 30% Temporary Evade Chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.15;
    },
    onThrusterAction(ship: Ship) {
      Command.addCommandResponse('Gained 30% temporary evade chance. This will decay ' + ship.evasionLoss*100 + '% each turn');
      ship.temporaryEvadeChance += 0.30;
      playerShip.modifyReactor(-1);
    },
  },
  [ShipPartKeys.THRUST_TUNER_E2]: {
    id: ShipPartKeys.THRUST_TUNER_E2,
    name: 'Thrust Tuner E2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['thrust tuner e2', 'thrust tuner'],
    description: "+25% Evade Chance. +25% escape chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.25;
    },
    escapeChance() {
      return 0.25;
    }
  },
  [ShipPartKeys.TWIN_JETS_E4]: {
    id: ShipPartKeys.TWIN_JETS_E4,
    name: 'Twin Jets E4',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['twin jets e4', 'twin jets'],
    description: "+10% Evade Chance. +15% escape chance.",
    sellPrice: 1,
    purchasePrice: 2,
    evadeChance() {
      return 0.1;
    },
    escapeChance() {
      return 0.15;
    }
  },
  [ShipPartKeys.TWIN_PROBE_E2]: {
    id: ShipPartKeys.TWIN_PROBE_E2,
    name: 'Twin Probe E2',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['twin probe e2', 'twin probe'],
    description: "+15% Evade Chance. +20% escape chance.",
    sellPrice: 2,
    purchasePrice: 3,
    evadeChance() {
      return 0.15;
    },
    escapeChance() {
      return 0.20;
    }
  },
  [ShipPartKeys.VECTOR_JETS_E3]: {
    id: ShipPartKeys.VECTOR_JETS_E3,
    name: 'Vector Jets E3',
    faction: Factions.VENTUS,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['vector jets e3', 'vector jets'],
    description: "+20% Evade Chance. +30% escape chance.",
    sellPrice: 3,
    purchasePrice: 4,
    evadeChance() {
      return 0.20;
    },
    escapeChance() {
      return 0.30;
    }
  },
  [ShipPartKeys.MG_RAID]: {
    id: ShipPartKeys.MG_RAID,
    name: 'MG Raid',
    faction: Factions.MAGNOMI,
    qualityLevel: 0,
    enemyLoot: true,
    command: ['mg raid', 'raid'],
    description: "+20% Evade Chance. Attacks are 15% more likely to miss.",
    sellPrice: 1,
    purchasePrice: 2,
    evadeChance() {
      return 0.20;
    },
    onAttackAction(attackAction: AttackAction) {
      attackAction.hitPercentageChance -= 0.15;
      return attackAction;
    },
  },
};

export function createShipPartFromOptions(options: { [key: string]: ShipPartData }): { [key: string]: ShipPart } {
  const items: { [key: string]: ShipPart } = {};
  for (const key in options) {
      items[key] = new ShipPart(options[key]);
  }
  return items;
};

export function createShipPartById(id: string): ShipPart | null {
  const itemData = shipPartList[id];
  if (itemData) {
      return new ShipPart(itemData);
  } else {
      console.error(`Ship Part with ID '${id}' not found.`);
      return null;
  }
};

export function findShipPartByCommand(command: string): ShipPartData | undefined {
  for (const key in shipPartList) {
      const shipPart = shipPartList[key];
      if (shipPart.command.includes(command)) {
          return shipPart;
      }
  }
  return undefined;
}

export function getShipPartInfo(commandBase: string, fullCommand: string) {
  const parts = fullCommand.split(' ');

  if (parts[0] != commandBase) {
      Command.addCommandResponse('Error: Invalid info command.');
      return false;
  }

  const itemCommand = parts.slice(1).join(' ');
  let item = findShipPartByCommand(itemCommand);

  // Check if item exists
  if (item == undefined) {
      Command.addCommandResponse('Error: Invalid item.');
      return false;
  }

  if (item.description == undefined) {
      Command.addCommandResponse('Error: Ship Part has no description.');
      return false;
  } else {
      Command.addCommandResponse(showShipPartData(item));
      return true;
  }
}

export function showShipPartData(shipPartData: ShipPartData) {
  let returnString = '<hr>';

  const dotdot = '...<br>';
  
  returnString += shipPartData.name +'<br>';
  returnString += 'Faction: ' + shipPartData.faction +'<br>';
  returnString += 'Description: ' + shipPartData.description +'<br>';

  returnString += '<hr>'

  return returnString;
}


  