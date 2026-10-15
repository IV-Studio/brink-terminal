import Station from "../station";
import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { world } from "./world";
import { playerShip } from "../Ship/ships";
import { getMapByCoordinates, mapTilesets } from "./mapData";
import { ItemContainerMapTile } from "../Items/itemContainerMapTile.ts";
import Clearance from "../clearance.js";
import Rooms from "../rooms.js";
import { ItemData, itemDataList, ItemKeys } from "../Items/itemList.ts";
import { EnemyType, getEnemyTypeById } from "../Combat/enemies.ts";
import { EnemyId } from "../Combat/enemyIds";
import { Item } from "../Items/items.ts";
import Keywords from "../keywords.js";

interface MapTile {
    tileId: number;
    row: number;
    column: number;
    explored: number;
    lootContainer: ItemContainerMapTile;
    enemy: string | null;
    riveTile: any;
    attributes: MapTileAttributes;
    lootChance: number;
    scanned: boolean;
}

interface MapTileAttributes {
    name: string;
    riveTile: number;
    attributes: string[];
    lootSpawnChance: number;
    lootQuantity: number;
    loot: string[];
    actions: CommandConfig[] | null;
    placeOfInterest: boolean;
    enemies: boolean;
    enemyToSpawn?: string;
}

interface MapTileData {
    [key: number]: MapTileAttributes;
}

class MapTileSet {
    x: number;
    y: number;
    tiles: {[row: number]: { [col: number]: MapTile}};
    enemySpawnChance: number;
    enemies: string[];
    name: string;

    constructor(x: number, y: number, name: string, tiles: {[row: number]: { [col: number]: MapTile}}, enemySpawnChance: number, enemies: string[]) {
        this.x = x;
        this.y = y;
        this.tiles = tiles;
        this.enemySpawnChance = enemySpawnChance;
        this.enemies = enemies;
        this.name = name;
    }
}

export interface Position {
    row: number;
    col: number;
}

const mapTileData: MapTileData = {
    0: {
        name: 'Empty Space',
        riveTile: -1,
        attributes: [],
        lootSpawnChance: 0.02,
        lootQuantity: 1,
        loot: [ItemKeys.SCRAP_METAL],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    1: {
        name: 'Small Asteroid',
        riveTile: 1,
        attributes: [],
        lootSpawnChance: 0.7,
        lootQuantity: 1,
        loot: [ItemKeys.IRON, ItemKeys.SCRAP_METAL, ItemKeys.COPPER, ItemKeys.ZINC],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    2: {
        name: 'Small Asteroids',
        riveTile: 2,
        attributes: [],
        lootSpawnChance: 0.7,
        lootQuantity: 2,
        loot: [ItemKeys.IRON, ItemKeys.SCRAP_METAL, ItemKeys.COPPER, ItemKeys.ZINC, ItemKeys.HYDROCARBONS, ItemKeys.SALT_DEPOSITS],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    3: {
        name: 'Medium Asteroid',
        riveTile: 3,
        attributes: [],
        lootSpawnChance: 1,
        lootQuantity: 1,
        loot: [ItemKeys.IRON, ItemKeys.WATER, ItemKeys.COPPER, ItemKeys.ZINC, ItemKeys.PHOSPHORUS, ItemKeys.COLBALT, ItemKeys.PALLADIUM, ItemKeys.GOLD, ItemKeys.HYDROCARBONS, ItemKeys.SALT_DEPOSITS],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    4: {
        name: 'Medium Asteroids',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0.9,
        lootQuantity: 2,
        loot: [ItemKeys.IRON, ItemKeys.SCRAP_METAL, ItemKeys.WATER, ItemKeys.SMALL_FUEL_CELL, ItemKeys.COPPER, ItemKeys.ZINC, ItemKeys.PHOSPHORUS, ItemKeys.COLBALT, ItemKeys.PALLADIUM, ItemKeys.GOLD],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    5: {
        name: 'Large Asteroid',
        riveTile: 5,
        attributes: [],
        lootSpawnChance: 0.9,
        lootQuantity: 3,
        loot: [ItemKeys.WATER, ItemKeys.LARGE_FUEL_CELL, ItemKeys.QUANTUM_FUEL_CELL, ItemKeys.REPAIR_NANO_DROIDS, ItemKeys.COPPER, ItemKeys.ZINC, ItemKeys.PHOSPHORUS, ItemKeys.COLBALT, ItemKeys.PALLADIUM, ItemKeys.GOLD, ItemKeys.DIAMONDS],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    20: {
        name: 'Light Gas',
        riveTile: 8,
        attributes: [],
        lootSpawnChance: 0.2,
        lootQuantity: 1,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    21: {
        name: 'Medium Gas',
        riveTile: 9,
        attributes: [],
        lootSpawnChance: 0.3,
        lootQuantity: 1,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    22: {
        name: 'Heavy Gas',
        riveTile: 10,
        attributes: [],
        lootSpawnChance: 0.5,
        lootQuantity: 1,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: true,
    },
    30: {
        name: 'Sorelia Mine Field',
        riveTile: 1,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    31: {
        name: 'Sorelia Mine Field',
        riveTile: 2,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    32: {
        name: 'Sorelia Mine Field',
        riveTile: 2,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    33: {
        name: 'Sorelia Mine Field',
        riveTile: 3,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    34: {
        name: 'Sorelia Mine Field',
        riveTile: 4,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    35: {
        name: 'Sorelia Mine Field',
        riveTile: 5,
        attributes: ['mine'],
        lootSpawnChance: 0.5,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
    },
    // Landmarks
    100: {
        name: 'Reiner Station',
        riveTile: 100,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        loot: [],
        actions: [
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    Station.enterStation('reiner-station');
                    world.exitWorld();
                    playerShip.onDock();
                },
                response: (): string => 'Docking at Reiner Station',
            }
        ],
        placeOfInterest: true,
        enemies: false,
    },
    101: {
        name: 'Leppik Station',
        riveTile: 100,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 0,
        loot: [],
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return false;
                    } else {
                        return true;
                    }
                },
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Leppik Station looms ahead of you. It would dwarf Reiner if they were side by side.<br>' +
                'Ships come and go from its hangar. Lights twinkle across the many-roomed appendages of the station. It\'s a hive city in space.<br><br>' +
                'You wonder briefly about all of the lives that intersect here and how every individual has their own life, their own ambitions. In this world, they\'re the protagonists and you\'re just passing through.',
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return true;
                    };
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    
                    Station.enterStation('leppik-station');
                    world.exitWorld();
                    playerShip.onDock();
                },
                response: (): string => 'Docking at Leppik Station',
            }
        ],
        placeOfInterest: true,
        enemies: false,
    },
    102: {
        name: 'Kaos Station',
        riveTile: 100,
        attributes: [],lootSpawnChance: 0.0,lootQuantity: 0,loot: [],
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return false;
                    } else {
                        return true;
                    }
                },
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Kaos Station bristles like a creature bred for war. More mobile armament system than space station, it reflects the singular mindset of Magnomi.<br><br>' +
                'Ships entering and leaving the hangar are escorted by dart-like single-occupancy fighter ships.<br><br>' +
                'You feel unwelcome before you ever land.'
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return true;
                    };
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                },
                action: (): void => {
                    
                    Station.enterStation('kaos-station');
                    world.exitWorld();
                    playerShip.onDock();
                },
                response: (): string => 'Docking at Kaos Station',
            }
        ],
        placeOfInterest: true,
        enemies: false,
    },
    103: {
        name: 'Queens Port',
        riveTile: 100,
        attributes: [],lootSpawnChance: 0.0,lootQuantity: 0,loot: [],
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return false;
                    } else {
                        return true;
                    }
                },
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Queens Port is one of the busiest places you\'ve ever visited. There are ships flying with such speed and intensity that you fear a collision at any moment. Always, at the last moment, the pilots veer off and avoid crashing, but it\'s hard to imagine they can sustain that every day without incident.<br><br>' +
                'For a people who believe in exodus, they are constantly in motion. Ventus is not taking its future lying down.<br><br>' +
                'The hangar beckons as a haven of safety amidst the mad dash of ships.'
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    if (Clearance.getClearanceLevel() > 3) {
                        return true;
                    };
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                },
                action: (): void => {
                    
                    Station.enterStation('queens-port');
                    world.exitWorld();
                    playerShip.onDock();
                },
                response: (): string => 'Docking at Queens Port',
            }
        ],
        placeOfInterest: true,
        enemies: false,
    },
    // CHAPTER 3
    201: {
        name: 'Derelict Ship',
        riveTile: 201,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals a derelict ship. Once it would have been a prized vessel, with powerful engines and hefty front cannons, but now it drifts lethargically in the dark.<br><br>' +
                'Fading callsigns and decorations painted on the hull reveal it to be an old Magnomi fighter.',
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('derelict-ship');
                    world.exitWorld();
                },
                response: (): string => 'Docking at Derelict Ship',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    202: {
        name: 'Unknown Probe',
        riveTile: 202,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals an unidentified probe. Dark metal plating protects the fragile inner workings of the device, but some scuffs on the hull suggest it\'s not avoided smaller debris fields.<br><br>' +
                'It\'s not large enough to dock against, but a shallow recess on one side indicates that you can <h>tether</h> a data cable directly to it.',
            },
            {
                command: function (command) {
                    return ['tether'].includes(command);
                },
                displayName: '[Tether]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('unknown-probe');
                    world.exitWorld();
                },
                response: (): string => 'Attempting tether...<br>...<br>...<br>...<br>Successfully tethered to Unknown Probe',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    203: {
        name: 'VEP-H5',
        riveTile: 5,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: function () {
                    if (Clearance.getClearanceLevel() >= 3) {
                        return 'Your scan shows the asteroid on which you met Oleg Ali.<br><br>' +
                        'There\'s no reason to land the ship.';
                    } else {
                        return 'Your scan shows the asteroid to be mostly barren except for a few irregularities. Ship debris, likely from an old skirmish. Some mineral deposits, grouped together enticingly on the southern side of the asteroid. And then an anomaly--a larger unidentified blip on the eastern hemisphere of the floating rock.<br><br>' +
                        'There\'s enough space to land the ship.';
                    }
                    
                } 
            },
            {
                command: function (command) {
                    return ['land'].includes(command);
                },
                displayName: '[Land]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null && Clearance.getClearanceLevel() <= 2) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('VEP-H5');
                    world.exitWorld();
                },
                response: (): string => 'Successfully landed on the asteroid near VEP-H5',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    204: {
        name: 'Komek Wreckage',
        riveTile: 3,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals wreckage from what appears to be two distinct ships.<br><br>' +
                'Further inspection confirms this, and you see insignia that declare these as Henko and Komek vessels.<br><br>' +
                'The Henko ship has been pulverized into smaller debris and there are no larger sections intact, but the Komek cruiser looks like it was strafed continuously until the ship split in two.<br><br>' +
                'You should be able to tether into the cockpit and learn about the ships\' final moments.',
            },
            {
                command: function (command) {
                    return ['tether'].includes(command);
                },
                displayName: '[Tether]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('komek-wreckage');
                    world.exitWorld();
                },
                response: (): string => 'Attempting tether...<br>...<br>...<br>...<br>Successfully tethered to Komek Wreckage.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    // CHAPTER 4
    205: {
        name: 'Moro Mada\'s Ship',
        riveTile: 201,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan illuminates the contours of a sleek, winged vessel. The dark metal hull is almost iridescent and as your ship approaches the ship shimmers in and out of view.<br><br>' +
                'You can board the other ship.',
            },
            {
                command: function (command) {
                    return ['board'].includes(command);
                },
                displayName: '[Board]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('moro-mada-ship');
                    world.exitWorld();
                },
                response: (): string => 'Boarding Moro Mada\'s Ship',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    206: {
        name: 'Probe XC41', // Ventus Probe
        riveTile: 201,
        attributes: [], lootSpawnChance: 0.0, lootQuantity: 1, loot: [], placeOfInterest: false,
        actions: [
            {
                command: function (command) {return ['scan'].includes(command);},
                displayName: '[Scan]',
                section: 'location',
                available: function () {return true;},
                action: (): void => {},
                response: (): string => 'Your scan reveals a discreet relay probe. It appears to be of the Sorelian origin.<br><br>A terminal on the side of the probe reads "Keyword Required. Enter your passkey + A7X9A"', // IF YOU ARE HERE, THIS IS CHEATING. I didn't have time to put this on the server.
            },
            {
                command: function (command) {
                    return ['glyph'].includes(command);
                },
                displayName: '',
                section: 'location',
                hidden() {return true;},
                available: (): boolean => { return true;},
                action: (): void => {},
                response: (): string => 'Enter [_____-A7X9A]',
            }
        ],
        enemies: false,
    },
    207: {
        name: 'Probe XB23', // Magnomi Probe
        riveTile: 201,
        attributes: [], lootSpawnChance: 0.0, lootQuantity: 1, loot: [], placeOfInterest: false,
        actions: [
            {
                command: function (command) {return ['scan'].includes(command);},
                displayName: '[Scan]',
                section: 'location',
                available: function () {return true;},
                action: (): void => {},
                response: (): string => 'Your scan reveals a discreet relay probe. It appears to be of the Sorelian origin.<br><br>A terminal on the side of the probe reads "Keyword Required. Enter your passkey + 9AV3N"', // IF YOU ARE HERE, THIS IS CHEATING. I didn't have time to put this on the server.
            },
            {
                command: function (command) {
                    return ['glyph'].includes(command);
                },
                displayName: '',
                section: 'location',
                hidden() {return true;},
                available: (): boolean => { return true;},
                action: (): void => {},
                response: (): string => 'Enter [_____-9AV3N]',
            }
        ],
        enemies: false,
    },
    208: {
        name: 'Probe XA89', // Henko Probe
        riveTile: 201,
        attributes: [], lootSpawnChance: 0.0, lootQuantity: 1, loot: [], placeOfInterest: false,
        actions: [
            {
                command: function (command) {return ['scan'].includes(command);},
                displayName: '[Scan]',
                section: 'location',
                available: function () {return true;},
                action: (): void => {},
                response: (): string => 'Your scan reveals a discreet relay probe. It appears to be of the Sorelian origin.<br><br>A terminal on the side of the probe reads "Keyword Required. Enter your passkey + MAV831"', // IF YOU ARE HERE, THIS IS CHEATING. I didn't have time to put this on the server.
            },
            {
                command: function (command) {
                    return ['glyph'].includes(command);
                },
                displayName: '',
                section: 'location',
                hidden() {return true;},
                available: (): boolean => { return true;},
                action: (): void => {},
                response: (): string => 'Enter [_____-MAV831]',
            }
        ],
        enemies: false,
    },
    209: {
        name: 'Probe XD14', // Komek Probe
        riveTile: 201,
        attributes: [], lootSpawnChance: 0.0, lootQuantity: 1, loot: [], placeOfInterest: false,
        actions: [
            {
                command: function (command) {return ['scan'].includes(command);},
                displayName: '[Scan]',
                section: 'location',
                available: function () {return true;},
                action: (): void => {},
                response: (): string => 'Your scan reveals a discreet relay probe. It appears to be of the Sorelian origin.<br><br>A terminal on the side of the probe reads "Keyword Required. Enter your passkey + 76CAL1"', // IF YOU ARE HERE, THIS IS CHEATING. I didn't have time to put this on the server.
            
            },
            {
                command: function (command) {
                    return ['glyph'].includes(command);
                },
                displayName: '',
                section: 'location',
                hidden() {return true;},
                available: (): boolean => { return true;},
                action: (): void => {},
                response: (): string => 'Enter [_____-76CAL1]',
            }
        ],
        enemies: false,
    },
    210: {
        name: 'Missing Ventus Shipment',
        riveTile: 201,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: function () {
                    if (!Keywords.checkForKeyword('reveal')) {
                        return 'At first your scan identifies the floating mass as a small asteroid, but once you maneuver closer, you realize it\'s a collection of large crates covered in black netting, stabilized with micro-thrusters.<br><br>' +
                        'You should be able to <h>load</h> the crates.';
                    } else {
                        return 'The large crates you once found here are gone.';
                    }   
                }
            },
            {
                command: function (command) {
                    return ['load'].includes(command);
                },
                displayName: '[Load]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null && !Keywords.checkForKeyword('reveal')) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('my-cargo-hold');
                    world.exitWorld();
                },
                response: (): string => 'You enter your ship\'s cargo hold.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    211: {
        name: 'Magnomi Warship',
        riveTile: 201,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: function () {
                    if (!Keywords.checkForKeyword('crumpled')) {
                        return 'Your scan reveals a Magnomi warship bearing down on you.<br><br>' +
                        'On <h>comms</h>, Ryan Rogal\'s smiling face looks down at you.'
                    } else {
                        return 'The Magnomi warship you once found here is gone.'
                    }   
                }
            },
            {
                command: function (command) {
                    return ['comms'].includes(command);
                },
                displayName: '[Comms]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null && !Keywords.checkForKeyword('crumpled')) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('magnomi-warship');
                    world.exitWorld();
                },
                response: (): string => 'Your comms channel opens.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    212: {
        name: 'Hidden-Base',
        riveTile: 5,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: function () { 
                    if (Keywords.checkForKeyword('good-game')) {
                        return 'The abandoned mining facility is still there, but Linus Farno\'s yacht is missing.<br><br>' +
                        'A cursory scan of the location reveals that it is now abandoned.<br><br>';
                    } else {
                        return 'Your scan reveals an abandoned mining facility on a asteroid that has been quarried and extracted to roughly half its original size. Most of the buildings are exposed to the atmosphere after falling into disrepair.<br><br>' +
                        'There is one noticable aberration among the ruins. Parked in the open docking bay is the shiny chrome pleasure yacht of Linus Farno. The visual confirmation is electronically verified by the strong signal on the tracking beacon that Nella van Daval stowed away on the vessel.<br><br>' +
                        'You can land your ship.'
                    } 
                } 
            },
            {
                command: function (command) {
                    return ['land'].includes(command);
                },
                displayName: '[Land]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null && !Keywords.checkForKeyword('good-game')) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('hidden-base');
                    world.exitWorld();
                },
                response: (): string => 'Successfully landed on the hidden base.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    // FINAL CHAPTER
    213: {
        name: 'Sorelia Waystation NX7',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals a Sorelian waystation much like the one where you encountered Oleg Ali.<br><br>' +
                'The station isn\'t large enough for a hangar, but docking terminals jut out from the central structure. At one of the airlocks, Moro Mada\'s ship is docked.<br><br>' +
                'You prepare to dock your ship.',
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('sorelia-waystation-1');
                    world.exitWorld();
                },
                response: (): string => 'Docking at Sorelia Waystation NX7',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    214: {
        name: 'Sorelia',
        riveTile: 5,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => "You don't need the scanner to tell you what's in front of your ship. You stare out from the pilot's seat and with certainty determine that no explanation will help connect the dots.<br><br>" +
                "Something's out there. It's not a space station. It's not a ship. It's not like anything you've seen before. Maybe it used to be alive, but then again maybe it just used to... be?<br><br>" +
                "And the scanner wouldn\'t even help because the instruments come back with nothing, as if they were being jammed. Which makes sense because whatever you're looking at is without a doubt why Sorelian technology looks like nothing else in Moonraker space.<br><br>" +
                "Something synthetic, something alien, something altogether surreal floats in front of you. And Sorelians have made a home on it. Ships, superstructures, docks, and every other element of Sorelian life adheres to this... thing like a writhing swarm picking a corpse clean.<br><br>" +
                "You don't even know where <h>to start</h>.",
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('sorelia');
                    world.exitWorld();
                },
                response: (): string => '',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    215: {
        name: 'Sorelia Waystation UW3',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'This outpost looks much like the last one, but there are subtle differences. And as you think back to the first waystation with Oleg, that one was unique as well.<br><br>' +
                'More and more, Sorelian technology strikes you as otherworldly.',
            },
            {
                command: function (command) {
                    return ['dock'].includes(command);
                },
                displayName: '[Dock]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('sorelia-waystation-2');
                    world.exitWorld();
                },
                response: (): string => 'Docking at Sorelia Waystation UW3',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    216: {
        name: 'Hidden-Sorelia-Waystation',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals a small space station, albeit a technologically advanced one. A more apt descriptor might be a scientific outpost. The sophisticated outer plating reminds you of Moro Mada\'s ship. If you weren\'t surrounded by vast expanses of gas, your ship instruments might not have picked it up.<br><br>' +
                'Before you move closer, though, another ship looms into view. A massive UA freighter.<br><br>' +
                'The sudden appearance shocks you, and it time dilates into a slow spiral for a moment before you recognize it as the mining-class vessel normally docked at Queens Port.<br><br>',
            },
            {
                command: function (command) {
                    return ['cargo'].includes(command);
                },
                displayName: '[Cargo]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('my-cargo-hold');
                    world.exitWorld();
                },
                response: (): string => 'You enter your ship\'s cargo hold.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    217: {
        name: 'Data-Vault',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0.0,
        lootQuantity: 1,
        actions: [
            {
                command: function (command) {
                    return ['scan'].includes(command);
                },
                displayName: '[Scan]',
                section: 'location',
                available: () => true,
                action: (): void => {
                    world.map.scanCurrentTile();
                },
                response: (): string => 'Your scan reveals an ominous orb floating (or flying?). If you were further away, it would appear to be a distant blot of dark in the roiling brightness of the nearby star.<br><br>' +
                'But up close, it\'s an almost flawless sphere. You can\'t discern much of how the orb functions.<br><br>' +
                'There is a recess to tether a data cable, though.',
            },
            {
                command: function (command) {
                    return ['tether'].includes(command);
                },
                displayName: '[Tether]',
                section: 'location',
                available: (): boolean => {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        return currentTile.scanned;
                    } else {
                        return false;
                    }
                    
                },
                action: (): void => {
                    Rooms.changeRoomState('data-vault');
                    world.exitWorld();
                },
                response: (): string => 'An onboard AI boots up and awaits your input.',
            }
        ],
        loot: [],
        placeOfInterest: true,
        enemies: false,
    },
    // BOSSES
    300: {
        name: 'Nox VI',
        riveTile: 1,
        attributes: [],
        lootSpawnChance: 0,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: false,
        enemies: false,
        enemyToSpawn: EnemyId.KNOX_VI,
    },
    301: {
        name: 'General Garda',
        riveTile: 4,
        attributes: [],
        lootSpawnChance: 0,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: true,
        enemies: false,
        enemyToSpawn: EnemyId.GENERAL_GARDA,
    },
    302: {
        name: 'General Purja',
        riveTile: 5,
        attributes: [],
        lootSpawnChance: 0,
        lootQuantity: 0,
        loot: [],
        actions: null,
        placeOfInterest: true,
        enemies: false,
        enemyToSpawn: EnemyId.GENERLA_PURJA,
    },


};


export class Map {
    //public mapTiles: { [row: number]: { [col: number]: MapTile } };

    public mapTileSets: MapTileSet[];

    private readonly startingLocation: Position = {
        row: 5,
        col: 5
    };

    private readonly startingTileset: Position = {
        row: 0,
        col: 0
    };
    
    
    public currentLocation: Position;
    public currentTileSet: Position;

    public shipDirection: number;

    constructor() {
        this.createFullMap();
        this.currentLocation = this.startingLocation;
        this.currentTileSet = this.startingTileset;
        this.shipDirection = 0;
    }

    public currentLocationGlobal() : Position {

        let row = -world.map.currentLocation.row + 5 + world.map.currentTileSet.col * 11;
        let col = world.map.currentLocation.col - 5 + world.map.currentTileSet.row * 11;
        return { row, col };
    }

    private createMapTile(row: number, column: number, tile: number): MapTile {
        const tileData = this.getMapTileData(tile);
        const mapTile: MapTile = {
            tileId: tile,
            row: row,
            column: column,
            explored: 0,
            lootContainer: new ItemContainerMapTile(),
            enemy: '', //testEnemy
            riveTile: tileData.riveTile,
            attributes: tileData,
            lootChance: tileData.lootSpawnChance,
            scanned: false
        };
        return mapTile;
    }

    private createFullMap() {
        this.mapTileSets = [];
        for (const tileset of mapTilesets) {

            const mapTiles = this.createMap(tileset.coordinates.x, tileset.coordinates.y);

            const mapTileSet = new MapTileSet(tileset.coordinates.x, tileset.coordinates.y, tileset.title, mapTiles, tileset.enemySpawnChance, tileset.enemies);

            this.mapTileSets.push(mapTileSet);
        }
    }

    private createMap(x: number, y: number): { [row: number]: { [col: number]: MapTile } } {

        const map: { [row: number]: { [col: number]: MapTile } } = {};

        const mapData = getMapByCoordinates(x, y);

        if (mapData != null ){
            const mapTiles = mapData.mapTiles;
            for (let i = 0; i < mapTiles.length; i++) {
                const row = mapTiles[i];

                const columnArray: { [key: number]: MapTile } = {};
    
                for (let k = 0; k < row.length; k++) {
                    const tileId = row[k];
                    if (mapTileData[tileId]) {
                        columnArray[k] = this.createMapTile(i, k, tileId);
                    } else {
                        console.warn(`Invalid tile ID: ${tileId} at position (${i}, ${k})`);
                        columnArray[k] = this.createMapTile(i, k, 0); // Default to an empty tile
                    }
                }
    
                map[i] = columnArray;
            }
        }
        return map;
    }

    private getCurrentTileset (): { [row: number]: { [col: number]: MapTile }} | undefined {
    
        for (const mapTileSet of this.mapTileSets) {
            if (mapTileSet.x == this.currentTileSet.row && mapTileSet.y == this.currentTileSet.col) {
                return mapTileSet.tiles;
            }
        }
        return undefined;
    }
    private getCurrentTilesetTitle (): string {
    
        let returnString = ''
        for (const mapTileSet of this.mapTileSets) {
            if (mapTileSet.x == this.currentTileSet.row && mapTileSet.y == this.currentTileSet.col) {
                returnString = mapTileSet.name;
            }
        }
        return returnString;
    }

    public refreshLoot() {
        this.mapTileSets.forEach((tileSet) => {
            for (const row in tileSet.tiles) {
                for (const col in tileSet.tiles[row]) {
                    const tile = tileSet.tiles[row][col];
                    tile.lootContainer = new ItemContainerMapTile();
                    tile.lootContainer.getRandomLoot(tile.tileId);
                }
            }
          });
    }

    public enemyLootSpawn(enemyType: EnemyType) {
        
        // Determine if loot spawns at all
        for (let i = 0; i < enemyType.lootQuantity; i++) {

            const randomIndex = Math.floor(Math.random() * enemyType.loot.length);
            const lootId = enemyType.loot[randomIndex];
            const item = itemDataList[lootId];

            this.getCurrentTile()?.lootContainer.addItem(new Item(item));
/*
            let availableItems: ItemData[] = [];
                let totalProbability: number = 0;
                //////
                // Determine which loot spawns
                for (const lootId of enemyType.loot) {
                    const item = itemDataList[lootId];
                    if (item.spawnChance) {
                        availableItems.push(item);
                        totalProbability += item.spawnChance;
                    }
                }

                // Generate a random number between 0 and the total probability
                const random: number = Math.random() * totalProbability;

                // Initialize cumulative probability
                let cumulativeProbability: number = 0;
                // Iterate through loot types
                for (const availableItem of availableItems) {

                    if (availableItem.spawnChance != null) {
                        // Add the normalized probability of the current loot type to cumulative probability
                        cumulativeProbability += availableItem.spawnChance / totalProbability;
                    }

                    // If the random number is less than cumulative probability, select this loot type
                    if (random < cumulativeProbability) {
                        this.getCurrentTile()?.lootContainer.addItem(new Item(availableItem));
                        break;
                    }
                }
                */
        }
    }

    public spawnEnemies() {
        if (Clearance.getClearanceLevel() < 3) {
            return;
        }
        this.mapTileSets.forEach((tileSet) => {
            for (const row in tileSet.tiles) {
                for (const col in tileSet.tiles[row]) {
                    const tile = tileSet.tiles[row][col];
                    
                    if(tileSet.enemySpawnChance > Math.random() && tile.attributes.enemies) {
                        //console.log('spawning enemy at ' + row + ' , ' + col + ' enemies = ' + tileSet.enemies);

                        let possibleEnemies: EnemyType[] = [];
                        let totalProbability = 0;

                        for (const enemyId of tileSet.enemies) {
                            let enemyType = getEnemyTypeById(enemyId);

                            if (enemyType != undefined) {
                                totalProbability += enemyType.spawnChance;
                                possibleEnemies.push(enemyType);
                            }
                        }

                        const randomEnemyChance = Math.random() * totalProbability;
                        let enemySpawnNumber = 0;
                        let enemySpawned = false;

                        for (const enemy of possibleEnemies) {

                            enemySpawnNumber += enemy.spawnChance;

                            if (randomEnemyChance <= enemySpawnNumber && enemySpawned == false) {
                                enemySpawned = true;
                                tile.enemy = enemy.id;
                                //console.log('spawning: ' + enemy.id + ' enemySpawnNumber = ' + enemySpawnNumber + ' totalProb: ' + totalProbability + ' randomChance: ' + randomEnemyChance);
                            }
                        }

                    } else {
                        tile.enemy = '';
                    }

                    if (tile.attributes.enemyToSpawn) {
                        tile.enemy = tile.attributes.enemyToSpawn;
                    }
                }
            }
          });
    }

    public onDeath() {
        /*
        this.mapTileSets.forEach((tileSet) => {
            for (const row in tileSet.tiles) {
                for (const col in tileSet.tiles[row]) {
                    const tile = tileSet.tiles[row][col];
                    tile.explored = 0;
                }
            }
          });
          */
        this.currentLocation.row = 5;
        this.currentLocation.col = 5;
        this.currentTileSet.row = 0;
        this.currentTileSet.col = 0;
    }

    public getMapTileData(tileId: number): MapTileAttributes {
        const tileData = mapTileData[tileId];
        if (tileData != null) {
            return tileData;
        } else {
            console.warn('Could not find Map Tile Data: ' + tileId + ', There is likely an incorrect id on the map');
            return mapTileData[0]; // Return default empty tile data
        }
    }

    public getTile(row: number, col: number): MapTile | undefined {
        const currentTileset = this.getCurrentTileset();

        return currentTileset?.[row]?.[col];
    }

    public move(direction: 'up' | 'down' | 'left' | 'right'): boolean {

        const currentTileset = this.getCurrentTileset();
        let moved = false;

        if (currentTileset != undefined) {
            const { row, col } = this.currentLocation;
            switch (direction) {
                case 'up':
                    if (row > 0) { 
                        this.currentLocation.row -= 1;
                        moved = true;
                    } else {
                        const newMap = getMapByCoordinates(this.currentTileSet.row, this.currentTileSet.col + 1);

                        if (newMap != null) {
                            if (newMap?.clearanceLevel > Clearance.getClearanceLevel()) {
                                Command.addCommandResponse('Clearance Level: ' + newMap?.clearanceLevel + ' is required to enter this sector.');
                            } else {
                                this.currentTileSet.col = this.currentTileSet.col + 1;
                            this.currentLocation.row = 10;
                                moved = true;
                            }
                            
                        } else {
                            Command.addCommandResponse('You\'ve reached the edge of the system');
                        }
                    }
                    if (moved) {
                        Command.addCommandResponse('Moved up.');
                    }
                    this.shipDirection = 1;
                    break;
                case 'down':
                    if (currentTileset[row + 1]) {
                        this.currentLocation.row += 1;
                        moved = true;
                    } else {
                        const newMap = getMapByCoordinates(this.currentTileSet.row, this.currentTileSet.col - 1);

                        if (newMap != null) {
                            if (newMap?.clearanceLevel > Clearance.getClearanceLevel()) {
                                Command.addCommandResponse('Clearance Level: ' + newMap?.clearanceLevel + ' is required to enter this sector.');
                            } else {
                                this.currentTileSet.col = this.currentTileSet.col - 1;
                                this.currentLocation.row = 0;
                                moved = true;
                            }
                            
                        } else {
                            Command.addCommandResponse('You\'ve reached the edge of the system');
                        }
                    }
                    if (moved) {
                        Command.addCommandResponse('Moved down.');
                    }
                    this.shipDirection = 3;
                    break;
                case 'left':
                    if (col > 0) {
                        this.currentLocation.col -= 1;
                        moved = true;
                    } else {
                        const newMap = getMapByCoordinates(this.currentTileSet.row - 1, this.currentTileSet.col);
                        
                        if (newMap != null) {
                            if (newMap?.clearanceLevel > Clearance.getClearanceLevel()) {
                                Command.addCommandResponse('Clearance Level: ' + newMap?.clearanceLevel + ' is required to enter this sector.');
                            } else {
                                this.currentTileSet.row = this.currentTileSet.row - 1;
                                this.currentLocation.col = 10;
                                moved = true;
                            }
                            
                        } else {
                            Command.addCommandResponse('You\'ve reached the edge of the system');
                        }
                    }
                    if (moved) {
                        Command.addCommandResponse('Moved left.');
                    }

                    this.shipDirection = 0;
                    break;
                case 'right':
                    if (currentTileset[row][col + 1]){
                        this.currentLocation.col += 1;
                        moved = true;
                    } else {
                        const newMap = getMapByCoordinates(this.currentTileSet.row + 1, this.currentTileSet.col);
                        if (newMap != null) {
                            if (newMap?.clearanceLevel > Clearance.getClearanceLevel()) {
                                Command.addCommandResponse('Clearance Level: ' + newMap?.clearanceLevel + ' is required to enter this sector.');
                            } else {
                                this.currentTileSet.row = this.currentTileSet.row + 1;
                                this.currentLocation.col = 0;
                                moved = true;
                            }
                            
                        } else {
                            Command.addCommandResponse('You\'ve reached the edge of the system');
                        }
                    }
                    if (moved) {
                        Command.addCommandResponse('Moved right.');
                    }
                    this.shipDirection = 2;
                    break;
            }
    
            this.exploreSurroundingTiles(this.currentLocation);
        }

        
        return moved;
    }
    

    public exploreSurroundingTiles(position: Position): void {

        const surroundingTiles = this.getSurroundingTiles(position);
        for (const tile of surroundingTiles) {
            tile.explored = 1;
            // Additional logic for exploring a tile can be added here
        }
    }

    private getSurroundingTiles(position: Position): MapTile[] {
        const { row, col } = position;
        const directions = [
            { row: 0, col: 0}, // The current tile
            { row: -1, col: 0 },  // Up
            { row: 1, col: 0 },   // Down
            { row: 0, col: -1 },  // Left
            { row: 0, col: 1 },   // Right
            { row: -1, col: -1 }, // Up-Left
            { row: -1, col: 1 },  // Up-Right
            { row: 1, col: -1 },  // Down-Left
            { row: 1, col: 1 }    // Down-Right
        ];

        const surroundingTiles: MapTile[] = [];

        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
            const tile = this.getTile(newRow, newCol);
            if (tile) {
                surroundingTiles.push(tile);
            }
        }

        return surroundingTiles;
    }

    public getCurrentTile(): MapTile | undefined {
        // Switched these recently, if something is wrong
        return this.getTile(this.currentLocation.row, this.currentLocation.col);
    }

    public removeEnemyFromTile() {
        const currentTile = this.getCurrentTile();
        if (currentTile) {
            currentTile.enemy = null;
        }
    }

    public scanCurrentTile() {
        const currentTile = this.getCurrentTile();
        if (currentTile != undefined) {
            currentTile.scanned = true;
        }
    }

    public getCurrentTileActions(): { [key: string]: CommandConfig } {
        const actions: { [key: string]: CommandConfig } = {};

        const mapTile = this.getTile(this.currentLocation.row, this.currentLocation.col);
        this.getCurrentTileset()

        if (mapTile != null) {
            const mapTileData = this.getMapTileData(mapTile.tileId);

            // CREATE INFO ACTION
            const tileInfo: CommandConfig = {
                command: (command) => {
                    return false;
                },
                displayName: () => {
                    return this.getCurrentTilesetTitle() + ": " + mapTileData.name + ' <span class="float-right">' + this.currentLocationGlobal().col + ',' + this.currentLocationGlobal().row + '</span>';
                },
                section: 'location',
                available: () => true,
                action: () => {},
            };

            actions.titleInfo = tileInfo;


            // PUSH ANY ACTIONS THAT THE TILE HAS
            let mapTileActionIndex = 0;
            if (mapTileData.actions != null) {
                mapTileData.actions.forEach(element => {
                    actions['mapTileAction-' + mapTileActionIndex] = element;
                    mapTileActionIndex++;
                    
                });
            }

            Object.assign(actions, mapTile.lootContainer.getContainerActions());
            
        } else {
            console.log('map tile is null');
        }
        
        return actions;
        
    }


}
