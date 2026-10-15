import { EnemyId } from "./enemyIds";
export { EnemyId } from "./enemyIds";
import Command from "../../command";
import { playerShip } from "../Ship/ships";
import { combat } from "./combat";
import { Ship } from "../Ship/shipBase";
import { AttackAction } from "./combatActions";
import { riveCombatEnemyAttack, riveEnemyDamaged } from "../../riveMap";
import { ItemKeys } from "../Items/itemList";
import { world } from "../Map/world";

type TurnAction = {
    name: string;
    intention: (enemy: Enemy) => string;
    execute: (enemy: Enemy) => void;
};


export class Enemy extends Ship {
    id: string;
    name: string;
    startingHealth: number;
    startingShield: number;
    turnActions: TurnAction[];
    baseEvadeChance: number;
    chooseTurnAction: (enemy: Enemy) => TurnAction;
    enemyOnCombatStart?: (enemy: Enemy) => void;
    nextTurnAction: TurnAction;

    constructor(id: string, name: string, startingHealth: number, startingShield: number, baseEvadeChance: number, evasionLoss: number, turnActions: TurnAction[], chooseTurnAction: (enemy: Enemy) => TurnAction, onCombatStart?: (enemy: Enemy) => void) {
        super();
        this.id = id;
        this.name = name;
        this.startingHealth = startingHealth;
        this.currentHealth = startingHealth;
        this.startingShield = startingShield;
        this.currentShield = startingShield;
        this.turnActions = turnActions;
        this.chooseTurnAction = chooseTurnAction;
        this.nextTurnAction = chooseTurnAction(this);
        this.isPlayer = false;
        this.enemyOnCombatStart = onCombatStart;
        this.evasionLoss = evasionLoss;
        this.baseEvadeChance = baseEvadeChance;
    }

    takeTurn() {
        this.nextTurnAction.execute(this);
        this.nextTurnAction = this.chooseTurnAction(this);
    }

    getMaxHealth(): number {
        return this.startingHealth;
    }
    getMaxShield(): number {
        return this.startingShield;
    }

    showIntent(): string {
        return this.nextTurnAction.intention(this);
    }

    death() {
        Command.addCommandResponse("Enemy has been destroyed");
        const enemyType = enemyTypes.find(type => type.id === this.id);
        if (enemyType != null) {
            world.map.enemyLootSpawn(enemyType);
        }   
        combat.enemyDestroyed();
    }

    onTakeDamage(): void {
        riveEnemyDamaged.fire();
    }

    getBaseEvadeChance(): number {
        return this.baseEvadeChance;
    }
    onCombatBegin(): void {
        super.onCombatBegin();
        if (this.enemyOnCombatStart) {
            this.enemyOnCombatStart(this);
        }
    }
}

// ENEMY ACTIONS
//
//
// ATTACK ACTIONS
const attackSmall: TurnAction = {
    name: 'Small Damage',
    intention: (enemy) => { return enemy.name + ' intends to Attack' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked.');
        const attackAction = new AttackAction({ damageAmount: 1, hitPercentageChance: 0.65});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};

const attackMedium: TurnAction = {
    name: 'Medium Damage',
    intention: (enemy) => { return enemy.name + ' intends to Attack' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked.');
        const attackAction = new AttackAction({ damageAmount: 2, hitPercentageChance: 0.65});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};

const attackLarge: TurnAction = {
    name: 'Large Attack',
    intention: (enemy) => { return enemy.name + ' is gearing up for a large Attack' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked.');
        const attackAction = new AttackAction({ damageAmount: 5, hitPercentageChance: 0.65});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};

const attackExtraLarge: TurnAction = {
    name: 'Extra Large Attack',
    intention: (enemy) => { return enemy.name + ' is gearing up for a mega Attack' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked.');
        const attackAction = new AttackAction({ damageAmount: 8, hitPercentageChance: 0.65});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};
const chargingAttack: TurnAction = {
    name: 'Charging Attack',
    intention: (enemy) => { return enemy.name + ' continues to charge their weapon.<br><br>'+ enemy.name + ' is gearing up for a charged Attack' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked.');
        const attackAction = new AttackAction({ damageAmount: 2 * combat.turn, hitPercentageChance: 0.75});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};

const attackShield: TurnAction = {
    name: 'Attack Shield',
    intention: (enemy) => { return enemy.name + ' intends to Attack Shield' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' attacked your shield.');
        playerShip.currentShield = 0;
        const attackAction = new AttackAction({ damageAmount: 0, hitPercentageChance: 1});
        playerShip.attack(attackAction);
        riveCombatEnemyAttack.fire();
    }
};

const siphonReactorSmall: TurnAction = {
    name: 'Siphon Reactor Small',
    intention: (enemy) => { return enemy.name + ' intends to siphon your Reactor' },
    execute: (enemy) => {
        playerShip.modifyReactor(-2);
        Command.addCommandResponse(combat.currentEnemy?.name + ' siphoned -1 Reactor.');
    }
};

const siphonReactorMedium: TurnAction = {
    name: 'Siphon Reactor Medium',
    intention: (enemy) => { return enemy.name + ' intends to siphon your Reactor' },
    execute: (enemy) => {
        playerShip.modifyReactor(-3);
        Command.addCommandResponse(combat.currentEnemy?.name + ' siphoned -2 Reactor.');
    }
};

const siphonReactorLarge: TurnAction = {
    name: 'Siphon Reactor Large',
    intention: (enemy) => { return enemy.name + ' intends to siphon your Reactor' },
    execute: (enemy) => {
        playerShip.modifyReactor(-4);
        Command.addCommandResponse(combat.currentEnemy?.name + ' siphoned -3 Reactor.');
    }
};

const shieldSmall: TurnAction = {
    name: 'Shield Recharge Small',
    intention: (enemy) => { return enemy.name + ' intends to recharge Shields' },
    execute: (enemy) => {
        enemy.modifyShields(1)
        Command.addCommandResponse(combat.currentEnemy?.name + ' recharge Shields +1.');
    }
};

const shieldMedium: TurnAction = {
    name: 'Shield Recharge Medium',
    intention: (enemy) => { return enemy.name + ' intends to recharge Shields' },
    execute: (enemy) => {
        enemy.modifyShields(2)
        Command.addCommandResponse(combat.currentEnemy?.name + ' recharge Shields +2.');
    }
};

const shieldLarge: TurnAction = {
    name: 'Shield Recharge Large',
    intention: (enemy) => { return enemy.name + ' intends to recharge Shields' },
    execute: (enemy) => {
        enemy.modifyShields(4)
        Command.addCommandResponse(combat.currentEnemy?.name + ' recharge Shields +4.');
    }
};

const repairLarge: TurnAction = {
    name: 'Repair Large',
    intention: (enemy) => { return enemy.name + ' intends to Repair' },
    execute: (enemy) => {
        enemy.modifyHealth(8);
        Command.addCommandResponse(combat.currentEnemy?.name + ' repair\'s +8 HP.');
    }
};

const evasiveActionSmall: TurnAction = {
    name: 'Evasive Action',
    intention: (enemy) => { return enemy.name + ' intends to Evade' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' took evasive actions. +15% Temporary Evade Chance');
        enemy.temporaryEvadeChance += 0.15;
    }
};

const evasiveActionMedium: TurnAction = {
    name: 'Evasive Action',
    intention: (enemy) => { return enemy.name + ' intends to Evade' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' took evasive actions. +25% Temporary Evade Chance');
        enemy.temporaryEvadeChance += 0.25;
    }
};

const evasiveActionLarge: TurnAction = {
    name: 'Evasive Action',
    intention: (enemy) => { return enemy.name + ' intends to Evade' },
    execute: (enemy) => {
        Command.addCommandResponse(combat.currentEnemy?.name + ' took evasive actions. +35% Temporary Evade Chance');
        enemy.temporaryEvadeChance += 0.35;
    }
};


const smallRepair: TurnAction = {
    name: 'Repair',
    intention: (enemy) => { return enemy.name + ' intends to Repair'},
    execute: (enemy) => {
        enemy.modifyHealth(2);
    }
};


export interface EnemyType {
    id: string;
    name: string;
    spawnChance: number;
    startingHealth: number;
    startingShield: number;
    turnActions: TurnAction[];
    chooseTurnAction: (enemy: Enemy) => TurnAction;
    lootSpawnChance: number;
    lootQuantity: number;
    loot: string[];
    onCombatStart?: (enemy: Enemy) => void;
    baseEvadeChance: number;
    evasionLoss: number;
}

export function createEnemyById(id: string): Enemy | undefined {
    const enemyType = enemyTypes.find(type => type.id === id);
    if (enemyType) {
        console.log('creating enemy');
        return new Enemy(
            id,
            enemyType.name,
            enemyType.startingHealth,
            enemyType.startingShield,
            enemyType.baseEvadeChance,
            enemyType.evasionLoss,
            enemyType.turnActions,
            enemyType.chooseTurnAction,
            enemyType.onCombatStart
        );
    }
    console.error(`Enemy type with ID '${id}' not found.`);
    return undefined;
}

export function getEnemyTypeById(id: string): EnemyType | undefined {
    const enemyType = enemyTypes.find(type => type.id === id);
    if (enemyType) {
        return enemyType;
    }
    console.error(`Enemy type with ID '${id}' not found.`);
    return undefined;
}



// ENEMY TYPES

const enemyTypes: EnemyType[] = [
    {
        id: EnemyId.TEST_ENEMY,
        name: 'Test Enemy',
        spawnChance: 0.5,
        startingHealth: 1,
        startingShield: 1,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackSmall, smallRepair],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            if (enemy.currentHealth == 1) {
                return enemy.turnActions.find(action => action.name == 'Repair')!;
            }
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 0.9,
        lootQuantity: 3,
        loot: [ItemKeys.DIAMONDS],
    },
    {
        id: EnemyId.TEST_ENEMY2,
        name: 'Test Enemy 2',
        spawnChance: 1,
        startingHealth: 1,
        startingShield: 1,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackSmall, smallRepair],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            if (enemy.currentHealth == 1) {
                return enemy.turnActions.find(action => action.name == 'Repair')!;
            }
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 0.9,
        lootQuantity: 3,
        loot: [ItemKeys.DIAMONDS],
    },
    {
        id: EnemyId.ROGUE_BANDIT, 
        name: 'Rogue Bandit',
        spawnChance: 1,
        startingHealth: 3,
        startingShield: 0,
        baseEvadeChance: 0,
        evasionLoss: 0.05,
        turnActions: [attackSmall, evasiveActionSmall, attackSmall, attackSmall],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 2,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SCRAP_METAL, ItemKeys.SMALL_FUEL_CELL],
    },
    // SCAVENGERS
    {
        id: EnemyId.JUNKER_SCAVENGER, 
        name: 'Junker Scavenger',
        spawnChance: 1,
        startingHealth: 4,
        startingShield: 2,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackSmall, shieldSmall, attackMedium],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 2,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SCRAP_METAL, ItemKeys.SMALL_FUEL_CELL],
    },
    {
        id: EnemyId.WARLORD_SCAVENGER, //WARLORD // APEX
        name: 'Warlord Scavenger',
        spawnChance: 0.5,
        startingHealth: 6,
        startingShield: 4,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackMedium, attackMedium, shieldSmall],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 3,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS],
    },
    {
        id: EnemyId.APEX_SCAVENGER, //WARLORD  // APEX
        name: 'Apex Scavenger',
        spawnChance: 0.2,
        startingHealth: 8,
        startingShield: 4,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackMedium, attackLarge, attackLarge, shieldMedium],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 4,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.REPAIR_KIT, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
    // MARAUDERS
    {
        id: EnemyId.SCRAP_MARAUDER, //WARLORD // APEX
        name: 'Scrap Marauder',
        spawnChance: 1,
        startingHealth: 8,
        startingShield: 0,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackMedium, evasiveActionSmall, attackLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 2,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SCRAP_METAL, ItemKeys.SMALL_FUEL_CELL],
    },
    {
        id: EnemyId.STEEL_MARAUDER, //WARLORD //RAIDER // APEX
        name: 'Steel Marauder',
        spawnChance: 0.5,
        startingHealth: 10,
        startingShield: 5,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackMedium, attackLarge, shieldMedium],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 3,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS],
    },
    {
        id: EnemyId.GOLD_MARAUDER, //WARLORD //RAIDER // APEX
        name: 'Gold Marauder',
        spawnChance: 0.4,
        startingHealth: 10,
        startingShield: 10,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackLarge, attackLarge, attackMedium, shieldLarge, attackExtraLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 4,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.REPAIR_KIT, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
    {
        id: EnemyId.KNOX_VI, //WARLORD //RAIDER // APEX
        name: 'Knox VI',
        spawnChance: 0.0,
        startingHealth: 25,
        startingShield: 10,
        baseEvadeChance: 0,
        evasionLoss: 0.1,
        turnActions: [attackExtraLarge, attackLarge, attackLarge, evasiveActionLarge, shieldLarge, repairLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 5,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.DIAMONDS, ItemKeys.COLBALT, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
    // VENTUS ENEMIES
    {
        id: EnemyId.DUSK_RAIDER,
        name: 'Dusk Raider',
        spawnChance: 1,
        startingHealth: 4,
        startingShield: 2,
        baseEvadeChance: 0.1,
        evasionLoss: 0.1,
        turnActions: [attackSmall, evasiveActionSmall, attackSmall],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 0.75,
        lootQuantity: 3,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SCRAP_METAL, ItemKeys.SMALL_FUEL_CELL],
    },
    {
        id: EnemyId.SHADOW_RAIDER,
        name: 'Shadow Raider',
        spawnChance: 0.5,
        startingHealth: 6,
        startingShield: 4,
        baseEvadeChance: 0.2,
        evasionLoss: 0.2,
        turnActions: [attackMedium, evasiveActionMedium, attackSmall],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 0.8,
        lootQuantity: 4,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.REPAIR_KIT, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS],
    },
    {
        id: EnemyId.VOID_RAIDER,
        name: 'Void Raider',
        spawnChance: 0.2,
        startingHealth: 8,
        startingShield: 0,
        baseEvadeChance: 0.1,
        evasionLoss: 0.1,
        turnActions: [attackSmall, attackMedium, attackSmall, evasiveActionLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        onCombatStart(enemy) {
            enemy.temporaryEvadeChance = 0.4;
        },
        lootSpawnChance: 0.8,
        lootQuantity: 5,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.REPAIR_KIT, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
    // SCAVENGERS
    {
        id: EnemyId.LIGHT_LIBERATOR, 
        name: 'Light Liberator',
        spawnChance: 1,
        startingHealth: 6,
        startingShield: 0,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackSmall, siphonReactorSmall, attackSmall],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 2,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.SCRAP_METAL, ItemKeys.SMALL_FUEL_CELL],
    },
    {
        id: EnemyId.DAWN_LIBERATOR, //WARLORD // APEX
        name: 'Warlord Scavenger',
        spawnChance: 0.5,
        startingHealth: 8,
        startingShield: 2,
        baseEvadeChance: 0,
        evasionLoss: 0,
        turnActions: [attackMedium, shieldSmall, siphonReactorSmall, siphonReactorMedium],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 3,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.COPPER, ItemKeys.IRON, ItemKeys.GOLD, ItemKeys.SMALL_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.SALT_DEPOSITS],
    },
    {
        id: EnemyId.SUN_LIBERATOR, //WARLORD  // APEX
        name: 'Apex Scavenger',
        spawnChance: 0.2,
        startingHealth: 8,
        startingShield: 4,
        baseEvadeChance: 0.1,
        evasionLoss: 0.35,
        turnActions: [attackSmall, attackSmall, evasiveActionLarge, shieldMedium, siphonReactorLarge, siphonReactorMedium],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 4,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.LARGE_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL,ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.GOLD, ItemKeys.LARGE_FUEL_CELL, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL],
    },
    {
        id: EnemyId.UA_FIGHTER, //WARLORD  // APEX
        name: 'UA Fighter',
        spawnChance: 0.25,
        startingHealth: 10,
        startingShield: 10,
        baseEvadeChance: 0.25,
        evasionLoss: 0.1,
        turnActions: [attackShield, attackMedium, evasiveActionMedium, attackLarge, attackExtraLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 4,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.LARGE_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL,ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.GOLD, ItemKeys.LARGE_FUEL_CELL, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL],
    },
    {
        id: EnemyId.UA_CAPTAIN, //WARLORD  // APEX
        name: 'UA Captain',
        spawnChance: 0.15,
        startingHealth: 20,
        startingShield: 10,
        baseEvadeChance: 0.25,
        evasionLoss: 0.1,
        turnActions: [attackShield, attackLarge, evasiveActionLarge, attackLarge, attackExtraLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 6,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.LARGE_FUEL_CELL, ItemKeys.LARGE_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL,ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.GOLD, ItemKeys.LARGE_FUEL_CELL, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL],
    },
    {
        id: EnemyId.GENERAL_GARDA, //
        name: 'General Garda',
        spawnChance: 0.0,
        startingHealth: 30,
        startingShield: 10,
        baseEvadeChance: 0,
        evasionLoss: 0.1,
        turnActions: [attackExtraLarge, attackLarge, attackLarge, evasiveActionLarge, shieldLarge, repairLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 7,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.DIAMONDS, ItemKeys.COLBALT, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
    {
        id: EnemyId.GENERLA_PURJA, //
        name: 'General Purja',
        spawnChance: 0.0,
        startingHealth: 50,
        startingShield: 10,
        baseEvadeChance: 0,
        evasionLoss: 0.1,
        turnActions: [chargingAttack, chargingAttack, chargingAttack, shieldLarge, repairLarge],
        chooseTurnAction: (enemy: Enemy): TurnAction => {
            const randomIndex = Math.floor(Math.random() * enemy.turnActions.length);
            return enemy.turnActions[randomIndex];
        },
        lootSpawnChance: 1,
        lootQuantity: 8,
        loot: [ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.SMALL_FUEL_CELL, ItemKeys.GOLD, ItemKeys.DIAMONDS, ItemKeys.COLBALT, ItemKeys.HYDROCARBONS, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_SENTRY],
    },
];