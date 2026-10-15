import { playerShip } from "../Ship/ships";

export enum StationKeys {
    REINER_STATION = 'reiner-station',
    KAOS_STATION = "kaos-station",
    LEPPIK_STATION = "leppik-station",
    QUEENS_PORT = "queens-port",
}

export enum ItemKeys {
    WATER = "water",
    SCRAP_METAL = "scrap-metal",
    IRON = "iron",
    COPPER = "copper",
    SMALL_FUEL_CELL = "small-fuel-cell",
    LARGE_FUEL_CELL = "large-fuel-cell",
    REPAIR_NANO_DROIDS = "repair-nano-droids",
    QUANTUM_FUEL_CELL = "QUANTUM_FUEL_CELL",
    REPAIR_KIT = "REPAIR_KIT_MKI",
    REPAIR_SENTRY = "REPAIR_SENTRY",
    JAVELINE_MISSILE = "JAVELINE_MISSILE",
    ZINC = "ZINC",
    PHOSPHORUS = "PHOSPHORUS",
    COLBALT = "COLBALT",
    PALLADIUM = "PALLADIUM",
    GOLD = "GOLD",
    DIAMONDS = "DIAMONDS",
    MICROBIAL_LIFE = "MICROBIAL_LIFE",
    SALT_DEPOSITS = "SALT_DEPOSITS",
    HYDROCARBONS = "HYDROCARBONS"
}

export const itemDataList: { [key: string]: ItemData; } = {
    [ItemKeys.WATER]: {
        id: ItemKeys.WATER,
        name: "Water",
        command: ['water'],
        description: "Heavy to transport, but a substance that is necessary to support all known life.",
        spawnChance: 0.5,
        sellPrice: 3,
        purchasePrice: 4,
    },
    [ItemKeys.SCRAP_METAL]: {
        id: ItemKeys.SCRAP_METAL,
        name: "Scrap Metal",
        command: ['scrap', 'scrap metal'],
        description: "Space junk, not good for much.",
        spawnChance: 0.5,
        sellPrice: 1,
        purchasePrice: 2,
    },
    [ItemKeys.IRON]: {
        id: ItemKeys.IRON,
        name: "Iron",
        command: ['iron'],
        description: "Common ore found on asteroids.",
        spawnChance: 0.5,
        sellPrice: 2,
        purchasePrice: 3,
    },
    [ItemKeys.COPPER]: {
        id: ItemKeys.COPPER,
        name: "Copper",
        command: ['copper'],
        description: "A highly conductive metal used in electrical wiring and electronics.",
        spawnChance: 0.4,
        sellPrice: 2,
        purchasePrice: 3,
    },
    [ItemKeys.ZINC]: {
        id: ItemKeys.ZINC,
        name: "Zinc",
        command: ['zinc'],
        description: "Used in galvanizing iron and steel to prevent rust.",
        spawnChance: 0.3,
        sellPrice: 3,
        purchasePrice: 4,
    },
    [ItemKeys.PHOSPHORUS]: {
        id: ItemKeys.PHOSPHORUS,
        name: "Phosphorus",
        command: ['phosphorus'],
        description: "An essential element for life, used in fertilizers and various chemicals.",
        spawnChance: 0.3,
        sellPrice: 3,
        purchasePrice: 4,
    },
    [ItemKeys.COLBALT]: {
        id: ItemKeys.COLBALT,
        name: "Colbalt",
        command: ['colbalt'],
        description: "Used in batteries, alloys, and as a pigment.",
        spawnChance: 0.3,
        sellPrice: 3,
        purchasePrice: 4,
    },
    [ItemKeys.PALLADIUM]: {
        id: ItemKeys.PALLADIUM,
        name: "Palladium",
        command: ['palladium'],
        description: "A precious metal used in electronics and catalytic converters.",
        spawnChance: 0.3,
        sellPrice: 4,
        purchasePrice: 5,
    },
    [ItemKeys.GOLD]: {
        id: ItemKeys.GOLD,
        name: "Gold",
        command: ['gold'],
        description: "A highly valuable metal often used in electronics and for currency.",
        spawnChance: 0.1,
        sellPrice: 6,
        purchasePrice: 8,
    },
    [ItemKeys.DIAMONDS]: {
        id: ItemKeys.DIAMONDS,
        name: "Diamond",
        command: ['diamond'],
        description: "A highly valuable metal often used in electronics and for currency.",
        spawnChance: 0.05,
        sellPrice: 10,
        purchasePrice: 12,
    },
    [ItemKeys.MICROBIAL_LIFE]: {
        id: ItemKeys.MICROBIAL_LIFE,
        name: "Microbial Life",
        command: ['microbial', 'microbial life'],
        description: "Microorganisms that could revolutionize our understanding of life in the universe. Or it could just be bacteria.",
        spawnChance: 0.08,
        sellPrice: 9,
        purchasePrice: 11,
    },
    [ItemKeys.SALT_DEPOSITS]: {
        id: ItemKeys.SALT_DEPOSITS,
        name: "Salt Deposits",
        command: ['salt', 'salt deposits'],
        description: "Useful for chemical processes and potentially for supporting life.",
        spawnChance: 0.3,
        sellPrice: 3,
        purchasePrice: 5,
    },
    [ItemKeys.HYDROCARBONS]: {
        id: ItemKeys.HYDROCARBONS,
        name: "Hydrocarbons",
        command: ['hydrocarbons'],
        description: "Could be used as fuel or raw materials for chemical synthesis.",
        spawnChance: 0.3,
        sellPrice: 3,
        purchasePrice: 5,
    },
    [ItemKeys.SMALL_FUEL_CELL]: {
        id: ItemKeys.SMALL_FUEL_CELL,
        name: "Small Fuel Cell",
        command: ['small fuel', 'small fuel cell'],
        description: "Small power reserve. [Use] to gain +2 Reactor power",
        spawnChance: 0.2,
        sellPrice: 1,
        purchasePrice: 1,
        supplyDepotStation: [StationKeys.LEPPIK_STATION, StationKeys.REINER_STATION, StationKeys.QUEENS_PORT, StationKeys.KAOS_STATION],
        useFunction() {
            playerShip.modifyReactor(2);
        },
    },
    [ItemKeys.LARGE_FUEL_CELL]: {
        id: ItemKeys.LARGE_FUEL_CELL,
        name: "Large Fuel Cell",
        command: ['large fuel', 'large fuel cell'],
        description: "Large power reserve. [Use] to gain +4 Reactor power",
        spawnChance: 0.1,
        sellPrice: 2,
        purchasePrice: 3,
        supplyDepotStation: [StationKeys.LEPPIK_STATION, StationKeys.REINER_STATION, StationKeys.QUEENS_PORT, StationKeys.KAOS_STATION],
        useFunction() {
            playerShip.modifyReactor(4);
        },
    },
    [ItemKeys.QUANTUM_FUEL_CELL]: {
        id: ItemKeys.QUANTUM_FUEL_CELL,
        name: "Quantum Fuel Cell",
        command: ['quantum', 'quantum fuel cell'],
        description: "Extra large power reserve. [Use] to fully recharge Reactor power",
        spawnChance: 0.05,
        sellPrice: 4,
        purchasePrice: 7,
        supplyDepotStation: [StationKeys.QUEENS_PORT],
        useFunction() {
            playerShip.modifyReactor(100);
        },
    },
    [ItemKeys.REPAIR_NANO_DROIDS]: {
        id: ItemKeys.REPAIR_NANO_DROIDS,
        name: "Repair Nano Droid",
        command: ['repair nano droid'],
        description: "Small one-time-use droid for minor hull repairs. [Use] to gain +1 Health.",
        spawnChance: 0.2,
        sellPrice: 1,
        purchasePrice: 3,
        supplyDepotStation: [StationKeys.LEPPIK_STATION, StationKeys.REINER_STATION, StationKeys.QUEENS_PORT, StationKeys.KAOS_STATION],
        useFunction() {
            playerShip.modifyHealth(1);
        },
    },
    [ItemKeys.REPAIR_KIT]: {
        id: ItemKeys.REPAIR_KIT,
        name: "Repair Kit",
        command: ['repair kit'],
        description: "One-time-use repair kit for minor hull repairs. [Use] to gain +3 Health.",
        spawnChance: 0.1,
        sellPrice: 3,
        purchasePrice: 5,
        supplyDepotStation: [StationKeys.LEPPIK_STATION, StationKeys.REINER_STATION, StationKeys.QUEENS_PORT, StationKeys.KAOS_STATION],
        useFunction() {
            playerShip.modifyHealth(3);
        },
    },
    [ItemKeys.REPAIR_SENTRY]: {
        id: ItemKeys.REPAIR_SENTRY,
        name: "Repair Sentry",
        command: ['repair sentry'],
        description: "One-time-use repair sentry for any and all hull repairs. [Use] to rull repair your ship",
        spawnChance: 0.05,
        sellPrice: 5,
        purchasePrice: 8,
        supplyDepotStation: [StationKeys.KAOS_STATION],
        useFunction() {
            playerShip.modifyHealth(100);
        },
    },
    [ItemKeys.JAVELINE_MISSILE]: {
        id: ItemKeys.JAVELINE_MISSILE,
        name: "Javeline Missile",
        command: ['javeline', 'javeline missile'],
        description: "A small missile that deals 2 damage.",
        spawnChance: 0.01,
        sellPrice: 1,
        purchasePrice: 2,
        useFunction() {
            /*
            if (combat.combatActive) {
                let attackAction = new AttackAction({ damageAmount: 2, hitPercentageChance: 1 });
                combat.currentEnemy?.attack(attackAction);
                riveCombatPlayerAttack.fire();
                combat.endPlayerTurn();
            } else {
                Command.addCommandResponse('You fire the missile into empty space.');
            }
            */
        },
    }
};
export interface ItemData {
    id: string;
    name: string;
    command: string[];
    description: string;
    sellPrice: number;
    purchasePrice: number;
    spawnChance?: number;
    spawnLocations?: number[];
    supplyDepotStation?: string[];
    useFunction?: () => void;
    combatUseFunction?: () => void;
}



