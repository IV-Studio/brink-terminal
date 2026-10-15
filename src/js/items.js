import World from "./world.js";
import getSMInstance from './statemanager.js';

const SM = getSMInstance();

const Items = {
    COMMON: 1,
    UNCOMMON: 0.5,
    RARE: 0.25,
    EPIC: 0.1,
    LEGENDARY: 0.02,

    DisplayInventory: {
        title: "--INVENTORY--",
        additionalActions: '',
        errorMessage: '',
        actionList: {
            'capacity': {
                command: [],
                section: 'storage',
                displayName: function () {
                    const container = SM.get('ship.inventory');
                    const currentStorage = container['maxSize'] - Items.checkContainerSpace(container);
                    return 'Capacity: ' + currentStorage  + ' / ' + container['maxSize'];
                },
                available: () => true,
            },
            'inventory': {
                command: [],
                section: 'storage',
                displayName: function () {
                    return Items.showContainerContents(SM.get('ship.inventory'));
                },
                available: function () { return true;},
                action: function () {},
            }
        },
    },
    
    ItemData: {
        'water': {
            id: 'water',
            name: 'Water',
            info: 'Heavy to transport, but a substance that is neccesary to support all known life.',
            type: 'resource',
            spawnChance: 0.5,
            spawnLocations: [1,2,3,4],
            cost: 4,
            sellPrice: 3,
            available: () => SM.checkCurrentState('world'),
            action: () => 'This cannot be used here', 
        },
        'scrapMetal': {
            id: 'scrapMetal',
            name: 'Scrap Metal',
            info: 'Space junk, good for melting into other alloys.',
            type: 'resource',
            spawnChance: 0.5,
            spawnLocations: [0,1,2,3],
            cost: 2,
            sellPrice: 1,
            available: () => SM.checkCurrentState('world'),
            action: () => 'This cannot be used here', 
        },
        'iron': {
            id: 'iron',
            name: 'Iron',
            info: 'Space junk, good for melting into other alloys.',
            type: 'resource',
            spawnChance: 0.5,
            spawnLocations: [0,1,2,3],
            cost: 2,
            sellPrice: 1,
            available: () => SM.checkCurrentState('world'),
            action: () => 'This cannot be used here', 
        },
    },
    
    getItem: function (id) {
        if (Items.ItemData[id] != null) {
            return Items.ItemData[id];
        } else {
            console.warn('Could not find item ' + id);
        }
    },
    
    // TO DO: support multiple loot generation. right now it only generates 1 element
    getRandomLoot: function (locationId) {
        // Check if the tile will get loot
        let tileLootProbability = World.getMapTileData(locationId)['lootChance'];
        const tileLootRandom = Math.random();

        let tileLoot = false;

        if (tileLootRandom > tileLootProbability) {
            tileLoot = true;
        }

        const container = Items.createItemContainer('Location Items', -1, false);
        // Get avilable items based on the location
        
        if (tileLoot == true) {

            let availableItems = [];
            let totalProbability = 0;

            for (const [key, value] of Object.entries(Items.ItemData)) {
                const item = Items.ItemData[key];
                if (item['spawnLocations'].includes(locationId) || item['spawnLocations'].includes('*')) {
                    availableItems.push(item);
                    totalProbability += item['spawnChance'];
                }
            }

            // Generate a random number between 0 and the total probability
            const random = Math.random() * totalProbability;

            // Initialize cumulative probability
            let cumulativeProbability = 0;

            // Iterate through loot types
            for (const availableItem of availableItems) {

                // Add the normalized probability of the current loot type to cumulative probability
                cumulativeProbability += availableItem['spawnChance'] / totalProbability;

                // If the random number is less than cumulative probability, select this loot type
                if (random < cumulativeProbability) {
                    Items.addItemToContainer(container, availableItem['id'], 1, false);
                }
            }
        }
        
        
        // In case something goes wrong, return null or handle it accordingly
        return container;
    },

    // INVENTORY
    
    showContainerContents: function (container) {

        let inventoryString = '';
        
        const inventory = container['items'];

        for (const [key, value] of Object.entries(inventory)) {
            console.log('key = ' + key + ' value = ' + value);
            inventoryString += value + ' ' + Items.getItem(key)['name'] + '</br>';
        }
        
        return inventoryString;
    },
    

    // returns true if adding was successful
    addItemToContainer: function (container, item, quantity = 1, displayReponse = true) {
        
        if (Items.checkContainerSpace(container) != -1) {
            if (Items.checkContainerSpace(container) <= 0) {
                if (displayReponse) {
                    Command.addCommandResponse(container['name'] + ' is full.');
                }
                return false;
            }
        }
        
        const containerItems = container['items'];
        
        if (containerItems[item]) {
            containerItems[item] += quantity;
        } else {
            containerItems[item] = quantity;
        }
        if (displayReponse) {
            Command.addCommandResponse('Gained ' + quantity + ' ' + item);
        }
        return true;
    },


    removeItemFromContainer: function (container, item, quantity = 1) {
        const containerItems = container['items'];
        if (containerItems[item]) {
            containerItems[item] -= quantity;
            if (containerItems[item] <= 0) {
                delete containerItems[item];
            }
        }
    },

    // if the container doesn't have a max size, it will return -1
    checkContainerSpace: function (container) {

        if (container['maxSize'] == -1) {
            return -1;
        }
        
        const containerMaxSize = container['maxSize'];

        let itemsInInventory = 0;
        
        const items = container['items'];

        for (let key in items) {
            itemsInInventory += items[key];
        }

        return containerMaxSize - itemsInInventory;
    },
    
    createItemContainer: function (name, maxSize, store) {
        const container = {};
        container['name'] = name;
        container['maxSize'] = maxSize;
        container['store'] = store;
        container['items'] = {};
        return container;
    }
}

export default Items;