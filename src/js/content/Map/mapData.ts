import { EnemyId } from "../Combat/enemyIds";

export interface Tileset {
    id: string;
    title: string;
    coordinates: {
        x: number;
        y: number;
    };
    sectorFaction: string;
    clearanceLevel: number;
    mapTiles: number[][];
    enemySpawnChance: number;
    enemies: string[];

}

export const mapTilesets: Tileset[] = [
    {
        id: 'henko-1',
        title: 'Henko Sector',
        sectorFaction: 'Henko',
        clearanceLevel: 1,
        mapTiles: [ // 100 - Reiner Station, 201 - derelict ship, 204 - Komek Wreckage, 203 - VEP-H5, 202 - unkown probe
            [0, 1, 0, 2, 0, 0, 0, 0, 0, 3, 1],
            [2, 4, 0, 204, 1, 0, 1, 0, 1, 4, 2],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 1, 0, 202, 1, 0],
            [1, 0, 201, 0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 1, 1, 0, 100, 0, 0, 0, 0, 0],
            [0, 1, 0, 2, 1, 0, 1, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0],
            [0, 0, 2, 0, 0, 1, 0, 0, 1, 2, 1],
            [208, 1, 0, 0, 0, 1, 203, 1, 0, 5, 0],
            [2, 3, 2, 0, 0, 3, 0, 0, 0, 3, 4]
        ],
        coordinates: {
            x: 0,
            y: 0
        },
        enemySpawnChance: 0.1,
        enemies: [EnemyId.ROGUE_BANDIT],
    },
    // I SEE YOU LOOKING AHEAD STOP IT NOW
    {
        id: 'magnomi-1',
        title: 'Magnomi Sector',
        sectorFaction: 'Magnomi', 
        clearanceLevel: 3,
        mapTiles: [ // 207 - Moros Magnomi Probe, 102 - Kaos Station, 300 - Knox Maruaders Boss, 211 - Magnomi Warship
            [0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 207, 1, 0, 1, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 102, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 211, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
            [0, 0, 2, 0, 0, 1, 0, 0, 1, 2, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 300, 0],
            [2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        coordinates: {
            x: 1,
            y: 0
        },
        enemySpawnChance: 0.2,
        enemies: [EnemyId.GOLD_MARAUDER, EnemyId.SCRAP_MARAUDER, EnemyId.STEEL_MARAUDER],
    },
    {
        id: 'asteroid-field',
        title: 'Sector 8X-0',
        sectorFaction: 'Nuetral',
        clearanceLevel: 3,
        mapTiles: [ // 205 Moro Mada's ship
            [0, 2, 0, 2, 4, 5, 2, 3, 2, 0, 0],
            [0, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0],
            [1, 3, 1, 205, 1, 2, 3, 1, 0, 2, 1],
            [5, 2, 3, 4, 2, 5, 4, 2, 4, 1, 0],
            [4, 5, 1, 0, 0, 1, 2, 3, 0, 2, 0],
            [3, 4, 5, 1, 2, 3, 0, 1, 3, 1, 1],
            [4, 1, 3, 0, 1, 5, 3, 4, 2, 0, 2],
            [1, 5, 4, 3, 1, 0, 0, 1, 1, 1, 0],
            [5, 0, 2, 2, 3, 1, 0, 0, 1, 2, 1],
            [0, 1, 1, 0, 5, 1, 2, 1, 3, 0, 0],
            [2, 3, 2, 3, 4, 5, 0, 4, 0, 0, 0]
        ],
        coordinates: {
            x: -1,
            y: 0
        },
        enemySpawnChance: 0.32,
        enemies: [EnemyId.JUNKER_SCAVENGER, EnemyId.APEX_SCAVENGER, EnemyId.WARLORD_SCAVENGER],
    },
    {
        id: 'komek-1',
        title: 'Komek Sector',
        sectorFaction: 'Komek',
        clearanceLevel: 3,
        mapTiles: [ // 101 - Leppik Station, 212 - hidden base, 209 Moro Komek Probe
            [0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 1, 0, 1, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 212, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 101, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
            [0, 0, 2, 0, 0, 1, 0, 209, 1, 2, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        coordinates: {
            x: 0,
            y: -1
        },
        enemySpawnChance: 0.32,
        enemies: [EnemyId.LIGHT_LIBERATOR, EnemyId.DAWN_LIBERATOR, EnemyId.SUN_LIBERATOR, EnemyId.UA_FIGHTER],
    },
    {
        id: 'ventus-1',
        title: 'Ventus Sector',
        sectorFaction: 'Ventus',
        clearanceLevel: 3,
        mapTiles: [ // 206 - Moros Ventus probe, 103 - Queens Port, 210 - missing shipment
            [0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 1, 0, 1, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 206, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 103, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 210, 1, 0],
            [3, 0, 2, 0, 0, 1, 0, 0, 1, 2, 1],
            [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
            [2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        coordinates: {
            x: 0,
            y: 1
        },
        enemySpawnChance: 0.32,
        enemies: [EnemyId.VOID_RAIDER, EnemyId.DUSK_RAIDER, EnemyId.SHADOW_RAIDER],
    },
    {
        id: 'nebula',
        title: 'Nebula B8-V',
        sectorFaction: 'Nuetral',
        clearanceLevel: 4,
        mapTiles: [ // 216 Oleg Ali-Sorelia Hidden base
            [0, 2, 0, 2, 4, 5, 2, 3, 2, 0, 0],
            [0, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0],
            [1, 3, 1, 3, 1, 2, 3, 1, 0, 2, 1],
            [5, 2, 3, 4, 2, 5, 216, 2, 4, 1, 0],
            [4, 5, 1, 0, 0, 1, 2, 3, 0, 2, 0],
            [3, 4, 5, 1, 2, 3, 0, 1, 3, 1, 1],
            [4, 1, 3, 0, 1, 5, 3, 4, 2, 0, 2],
            [1, 5, 4, 3, 1, 0, 0, 1, 1, 1, 0],
            [5, 0, 2, 2, 3, 1, 0, 0, 1, 2, 1],
            [0, 1, 1, 0, 5, 1, 2, 1, 3, 0, 0],
            [2, 3, 2, 3, 4, 5, 0, 4, 0, 0, 0]
        ],
        coordinates: {
            x: -1,
            y: 1
        },
        enemySpawnChance: 0.32,
        enemies: [EnemyId.UA_FIGHTER, EnemyId.GOLD_MARAUDER, EnemyId.WARLORD_SCAVENGER],
    },
    {
        id: 'utopian-alliance',
        title: 'Utopian Alliance',
        sectorFaction: 'Utopian Alliance',
        clearanceLevel: 4,
        mapTiles: [
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 1],
            [2, 4, 0, 0, 1, 0, 1, 0, 1, 4, 2],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 301, 0, 1, 2, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0],
            [0, 0, 2, 0, 0, 1, 0, 0, 1, 2, 1],
            [0, 1, 0, 0, 0, 1, 0, 1, 0, 5, 0],
            [0, 0, 2, 0, 0, 3, 0, 0, 0, 3, 4]
        ],
        coordinates: {
            x: 1,
            y: -1
        },
        enemySpawnChance: 0.32,
        enemies: [EnemyId.UA_FIGHTER, EnemyId.UA_CAPTAIN],
    },
    {
        id: 'Akmar',
        title: 'Akmar',
        sectorFaction: 'Nuetral',
        clearanceLevel: 4,
        mapTiles: [ // 217 Data Vault // 302 General
            [0, 2, 0, 2, 4, 5, 2, 3, 2, 0, 0],
            [0, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0],
            [1, 3, 1, 3, 1, 2, 3, 1, 0, 2, 1],
            [5, 2, 3, 4, 2, 5, 4, 2, 4, 1, 0],
            [4, 5, 1, 0, 0, 1, 217, 3, 0, 2, 0],
            [3, 4, 5, 1, 2, 3, 0, 1, 3, 1, 1],
            [4, 1, 3, 0, 302, 5, 3, 4, 2, 0, 2],
            [1, 5, 4, 3, 1, 0, 0, 1, 1, 1, 0],
            [5, 0, 2, 2, 3, 1, 0, 0, 1, 2, 1],
            [0, 1, 1, 0, 5, 1, 2, 1, 3, 0, 0],
            [2, 3, 2, 3, 4, 5, 0, 4, 0, 0, 0]
        ],
        coordinates: {
            x: -1,
            y: -1
        },
        enemySpawnChance: 0.25,
        enemies: [EnemyId.UA_FIGHTER, EnemyId.APEX_SCAVENGER, EnemyId.WARLORD_SCAVENGER, EnemyId.SUN_LIBERATOR],
    },
    {
        id: 'Sorelia',
        title: 'Sorelia',
        sectorFaction: 'Sorelia',
        clearanceLevel: 4,
        mapTiles: [ // 213 = Waystation 1, // 214 = Sorlia, // 25 Waystation 2
            [30, 31, 30, 2, 3, 3, 35, 3, 2, 4, 34],
            [1, 3, 35, 2, 32, 1, 3, 213, 34, 2, 35],
            [33, 3, 32, 3, 35, 33, 32, 30, 3, 2, 30],
            [30, 2, 3, 4, 30, 31, 33, 32, 4, 33, 32],
            [31, 32, 31, 30, 33, 34, 35, 35, 1, 3, 4],
            [31, 30, 33, 34, 2, 214, 31, 33, 32, 30, 1],
            [30, 32, 3, 2, 4, 34, 35, 30, 31, 1, 2],
            [35, 33, 4, 32, 31, 3, 2, 1, 32, 1, 33],
            [33, 30, 2, 2, 3, 1, 33, 3, 215, 2, 33],
            [30, 31, 33, 35, 34, 33, 32, 31, 30, 31, 30],
            [32, 35, 33, 34, 32, 32, 31, 32, 30, 35, 34]
        ],
        coordinates: {
            x: 1,
            y: 1
        },
        enemySpawnChance: 0.0,
        enemies: [],
    },
    
]

export function getMapByCoordinates(x: number, y: number): Tileset | null {
    for (const tileset of mapTilesets) {
        if (tileset.coordinates.x === x && tileset.coordinates.y === y) {
            return tileset;
        }
    }
    return null; // If no map is found with the given coordinates
}