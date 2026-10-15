
import Actions from "./actions.js";
import Command from "./command.js";
import Items from "./items.js";
import Station from "./content/station.js";
import Ships from "./ships.js";
import ShipParts from "./shipParts.js";
import getSMInstance from './statemanager.js';
import { playerShip } from "./content/Ship/ships.ts";
import { world } from "./content/Map/world.ts";

const SM = getSMInstance();

const World = {

    RADIUS: 30,
    STARTING_POS: [5, 5],
    LANDMARKS: {},
    NORTH: [-1, 0],
    SOUTH: [1, 0],
    WEST: [0, -1],
    EAST: [0, 1],
    MAPVIEW: [11,11],
    
    day: 0,
    name: 'World',
    map: [],
    shipDirection: [0,0],

    init: function () {
    },
    Actions: {
        title: "--EXPLORE--",
        errorMessage: "Error: Did not recognize command.",
        state: 'world',
        actionTitle: () => '--EXPLORE--',
        displayTitle: () => 'Explore Actions',
        onEntry: function () { 
            World.enterWorld();
        },
        onExit: function () {
        },
        entryCommandMessage: function () {return '<hr>You\'ve left the station.'},
        entryDisplayMessage: function () {return ''},
        additionalActions: function () {return [World.Info, Ships.StatusDisplay, Items.DisplayInventory]},
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            var combinedList = {...World.Actions.actionList, ...Ships.StatusDisplay.actionList, ... Items.DisplayInventory.actionList, ... world.commands};
            return combinedList;
        }, 
        errorMessage: "You can't do that here.",
        actionList: {
            
            /*
            'dock': {
                command: ['dock', 'd', 'Dock', 'D',],
                displayName: '[Dock]',
                section: 'location',
                available: function () {
                    if (SM.checkCurrentState('world')) {
                        const currentLocation = World.getCurrentMapTile();
                        if (currentLocation['landmark'] != null) {
                            const landmark = World.getLandmark(currentLocation['landmark']);
                            if (landmark['actions'].includes('dock')) {
                                return true;
                            }
                        }
                    }
                    return false;
                },
                action: function () {
                    return World.dockAtStation();
                },
            },
            
            'loot': {
                command: ['loot', 'Loot',],
                displayName: '[Loot]',
                section: 'location',
                available: function () {
                    if (SM.checkCurrentState('world')) {
                        const currentLocation = World.getCurrentMapTile();
                        if (Object.keys(currentLocation['items']).length > 0) {
                            return true;
                        }
                    }
                    return false;
                },
                action: function () {
                    return World.lootCurrentLocation();
                },
            }
            */
        }
    },

    Info: {
        title: "--LOCATION--",
        additionalActions: [],
        errorMessage: '',
        actionList: {
            'location': {
                command: function () { return false },
                section: 'location',
                displayName: function() { 
                    const currentMapTile = World.getCurrentMapTile();
                    let items = currentMapTile['items'];
                    return Items.showContainerContents(items);
                },
                available: function () { return true },
                action: function () {},
            },
        }
    },
    
    MapTileData: {
        0 : {
            name: 'Empty',
            mapTile: -1,
            attributes: [],
            lootChance: 0.1,
        },
        1 : {
            name: 'Small Asteroid',
            mapTile: 1,
            attributes: [],
            lootChance: 0.5,
        },
        2 : {
            name: 'Small Asteroids',
            mapTile: 2,
            attributes: [],
            lootChance: 0.5,
        },
        3 : {
            name: 'Medium Asteroid',
            mapTile: 3,
            attributes: ['lootMedium'],
            lootChance: 1,
        },
        4 : {
            name: 'Medium Asteroids',
            mapTile: 4,
            attributes: ['lootMedium'],
            lootChance: 1,
        },
        5 : {
            name: 'Large Asteroid',
            mapTile: 5,
            attributes: ['lootHigh'],
            lootChance: 1,
        },
        20 : {
            name: 'Light Gas',
            mapTile: 8,
            attributes: [],
            lootChance: 0.2,
        },
        21 : {
            name: 'Medium Gas',
            mapTile: 9,
            attributes: [],
            lootChance: 0.3,
        },
        22 : {
            name: 'Heavy Gas',
            mapTile: 10,
            attributes: [],
            lootChance: 0.5,
        }
    },
    
    LandmarkData: {
        'reiner-station': {
            id: 'reiner-station',
            name: 'Reiner Station',
            mapTile: 100,
            actions: ['dock'],
        }
    },
    enterWorld: function () {
        world.enterWorld();
        //World.exploreTiles();
        //World.drawMap();
        //World.refreshAllMapTiles();
        SM.set('game.currentState', 'world');
        Actions.showActions();
    },
    
    exitWorld: function () {
        world.exitWorld();
    },

    setCurrentLocation: function (newCurrentLocation) {
        SM.set('ship.location', newCurrentLocation);
    },
    
    nextDay: function() {
        World.day++;
        SM.set('day', World.day);
    },
    
    drawMap: function () {
        //updateMapTiles();
    },
    
    placeLandmarks: function () {
        World.placeLandmark('reiner-station', World.STARTING_POS[0], World.STARTING_POS[1]);
    },

    placeLandmark: function(landmarkID, x, y) {
        const mapTile = World.getMapTile(x, y);
        mapTile['landmark'] = landmarkID;
        mapTile['tile'] = World.getLandmark(landmarkID)['mapTile'];
    },
    
    getLandmark: function(landmarkID) {
        if (World.LandmarkData[landmarkID] != null){
            return World.LandmarkData[landmarkID];
        } else {
            console.warn('Could not find landmark ' + landmarkID);
        }
    },
    
    getMapTile: function(row, column) {
        const currentMapName = SM.get('maps.currentMap');
        const currentMap = SM.get('maps.' + currentMapName);
        return currentMap[row][column];
    },

    getCurrentMapTile: function() {
        const currentMapName = SM.get('maps.currentMap');
        const currentMap = SM.get('maps.' + currentMapName);
        const currentLocation = World.getCurrentLocation();
        return currentMap[currentLocation[0]][currentLocation[1]];
    },
    
    refreshMapTiles: function (row, column) {
        
        const currentMapName = SM.get('maps.currentMap');
        const currentMap = SM.get('maps.' + currentMapName);
        
        const mapTile = currentMap[row][column];

        // ADD LOOT TO TILE
        if (mapTile != null) {
            
            mapTile['items'] = Items.getRandomLoot(mapTile['id']);
            
            mapTile['enemy'] = '';
            
        } else {
            console.warn("Cannot find a map tile with this location")
        }
        
    },
    
    updateMapTile: function(mapTile, row, column) {
        const currentMapName = SM.get('maps.currentMap');
        const currentMap = SM.get('maps.' + currentMapName);
    },
    
    refreshAllMapTiles: function (){
        
        const currentMapName = SM.get('maps.currentMap');
        const currentMap = SM.get('maps.' + currentMapName);

        for (var i = 0; i < Object.keys(currentMap).length; i++) {

            for (var k = 0; k < Object.keys(currentMap[0]).length; k++) {

                World.refreshMapTiles(i,k);
            }

        }
    },
    
    getMapTileData: function(id) {
        if (World.MapTileData[id] != null) {
            return World.MapTileData[id];
        } else {
            console.warn('Could not find Map Tile Data: ' + id + ', There is likely an incorrect id on the map');
        }
    },
    
    lootCurrentLocation: function () {
        if (SM.checkCurrentState('world')) {
            const currentLocation = World.getCurrentMapTile();
            
            const locationItems = currentLocation['items']['items'];
            
            if (Object.keys(locationItems).length > 0) {
                for (let key in locationItems) {
                    let itemAdded = Items.addItemToContainer(SM.get('ship.inventory'), key, locationItems[key], true);
                    if (itemAdded == true) {
                        Items.removeItemFromContainer(currentLocation['items'], key, locationItems[key], false);
                    }
                }
            } else {
                Command.addCommandResponse("There's nothing here to loot.");
            }
            Actions.refreshCurrentActions();
        }
    },
    
    dockAtStation: function() {
        if (SM.checkCurrentState('world')) {
            const currentLocation = World.getCurrentMapTile();
            if (currentLocation['landmark'] != null) {
                const landmark = World.getLandmark(currentLocation['landmark']);
                if (landmark['actions'].includes('dock')) {
                    Station.enterStation(landmark['id']);
                    World.exitWorld();
                    playerShip.onDock();
                    ShipParts.onDock();
                    Command.addCommandResponse('Docking at ' + landmark['name']);
                }
            }
        }
    }
}



function fetchJSONFile(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching JSON file:', error);
        });
}

export default World;