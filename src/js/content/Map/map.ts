import Station from "../station";
import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { world } from "./world";
import { playerShip } from "../Ship/ships";
import { getMapByCoordinates, mapTilesets } from "./mapData";
import { ItemContainerMapTile } from "../Items/itemContainerMapTile.ts";
import Clearance from "../clearance.js";
import Rooms from "../rooms.js";
import { ItemData, itemDataList } from "../Items/itemList.ts";
import { EnemyType, getEnemyTypeById } from "../Combat/enemies.ts";
import { Item } from "../Items/items.ts";
import Keywords from "../keywords.js";

import { createMapTileData } from './tileDefinitions';
import type { MapTileAttributes } from './tileDefinitions';

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

const mapTileData = createMapTileData({
    enterStation: station => Station.enterStation(station),
    scanCurrentTile: () => world.map.scanCurrentTile(),
    getCurrentTile: () => world.map.getCurrentTile(),
    exitWorld: () => world.exitWorld(),
    onDock: () => playerShip.onDock(),
    getClearanceLevel: () => Clearance.getClearanceLevel(),
    changeRoomState: room => Rooms.changeRoomState(room),
    checkForKeyword: keyword => Keywords.checkForKeyword(keyword),
});

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
