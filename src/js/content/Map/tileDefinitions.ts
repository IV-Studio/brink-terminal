import type { CommandConfig } from '../Interfaces/commands';
import { ItemKeys } from '../Items/itemKeys';
import { EnemyId } from '../Combat/enemyIds';

export interface MapTileAttributes {
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

export interface MapTileData {
    [key: number]: MapTileAttributes;
}

/** Runtime callbacks are invoked only when a tile command is evaluated or executed. */
export interface MapTileServices {
    enterStation(station: string): void;
    scanCurrentTile(): void;
    getCurrentTile(): { scanned: boolean } | null | undefined;
    exitWorld(): void;
    onDock(): void;
    getClearanceLevel(): number;
    changeRoomState(room: string): void;
    checkForKeyword(keyword: string): boolean;
}

export function createMapTileData(game: MapTileServices): MapTileData {
    return {
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
                        game.enterStation('reiner-station');
                        game.exitWorld();
                        game.onDock();
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
                        if (game.getClearanceLevel() > 3) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    action: (): void => {
                        game.scanCurrentTile();
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
                        if (game.getClearanceLevel() > 3) {
                            return true;
                        };
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        
                        game.enterStation('leppik-station');
                        game.exitWorld();
                        game.onDock();
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
                        if (game.getClearanceLevel() > 3) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    action: (): void => {
                        game.scanCurrentTile();
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
                        if (game.getClearanceLevel() > 3) {
                            return true;
                        };
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                    },
                    action: (): void => {
                        
                        game.enterStation('kaos-station');
                        game.exitWorld();
                        game.onDock();
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
                        if (game.getClearanceLevel() > 3) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    action: (): void => {
                        game.scanCurrentTile();
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
                        if (game.getClearanceLevel() > 3) {
                            return true;
                        };
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                    },
                    action: (): void => {
                        
                        game.enterStation('queens-port');
                        game.exitWorld();
                        game.onDock();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('derelict-ship');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('unknown-probe');
                        game.exitWorld();
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
                        game.scanCurrentTile();
                    },
                    response: function () {
                        if (game.getClearanceLevel() >= 3) {
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null && game.getClearanceLevel() <= 2) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('VEP-H5');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('komek-wreckage');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('moro-mada-ship');
                        game.exitWorld();
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
                        game.scanCurrentTile();
                    },
                    response: function () {
                        if (!game.checkForKeyword('reveal')) {
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null && !game.checkForKeyword('reveal')) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('my-cargo-hold');
                        game.exitWorld();
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
                        game.scanCurrentTile();
                    },
                    response: function () {
                        if (!game.checkForKeyword('crumpled')) {
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null && !game.checkForKeyword('crumpled')) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('magnomi-warship');
                        game.exitWorld();
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
                        game.scanCurrentTile();
                    },
                    response: function () { 
                        if (game.checkForKeyword('good-game')) {
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null && !game.checkForKeyword('good-game')) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('hidden-base');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('sorelia-waystation-1');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('sorelia');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('sorelia-waystation-2');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('my-cargo-hold');
                        game.exitWorld();
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
                        game.scanCurrentTile();
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
                        const currentTile = game.getCurrentTile();
                        if (currentTile != null) {
                            return currentTile.scanned;
                        } else {
                            return false;
                        }
                        
                    },
                    action: (): void => {
                        game.changeRoomState('data-vault');
                        game.exitWorld();
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
}
