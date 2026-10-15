import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { world } from "../Map/world";
import { playerShip } from "../Ship/ships";
import { ItemContainer } from "./itemContainer";
import { Item } from "./items";
import { ItemData } from "./itemList";
import { itemDataList } from "./itemList";

export class ItemContainerMapTile extends ItemContainer {

    constructor(capacity?: number) {
        super(capacity);
    }

    getContainerActions(): { [key: string]: CommandConfig } {
        const actions: { [key: string]: CommandConfig } = super.getContainerActions();

        const lootCommand: CommandConfig = {
            command: (command) => {
                const parts = command.split(' ');
                return (['loot', 'loot all'].includes(command) || parts[0] === 'loot');
            },
            displayName: () => {
                if (this.getTotalQuantity() > 0) {
                    return '<hr class="dark">' + this.showContainerContents() + '[Loot]';
                } else {
                    return '';
                }
            },
            section: 'location',
            available: () => this.getTotalQuantity() > 0,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'loot') {
                    Command.addCommandResponse('To loot this location, enter [Loot All], or to loot specific items enter [Loot 2 Iron].');
                } else if (command == 'loot all') {
                    this.transferAllItems(this, playerShip.itemContainer);
                } else if (parts[0] === 'loot') {
                    this.transferItems(this, playerShip.itemContainer, 'loot', command);
                }
            },
        };

        actions.loot = lootCommand;

        return actions;
    }

    getRandomLoot(locationId: number): void {

        const location = world.map.getMapTileData(locationId);

        // Determine if loot spawns at all
        for (let i = 0; i < location.lootQuantity; i++) {
            if (Math.random() <= location.lootSpawnChance) {
                
                let availableItems: ItemData[] = [];
                let totalProbability: number = 0;
                //////
                // Determine which loot spawns
                for (const lootId of location.loot) {
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
                        this.addItem(new Item(availableItem));
                        break;
                    }
                }
            }
        }
    }

/*
    getRandomLoot(locationId: number): void {
        // Check if the tile will get loot
        let tileLootProbability: number = world.map.getMapTileData(locationId).lootSpawnChance;
        const tileLootRandom: number = Math.random();

        let tileLoot: boolean = false;

        if (tileLootRandom > tileLootProbability) {
            tileLoot = true;
        }

        // Get available items based on the location

        if (tileLoot == true) {

            let availableItems: ItemData[] = [];
            let totalProbability: number = 0;

            for (const key in itemDataList) {
                if (itemDataList.hasOwnProperty(key)) {
                    const value = itemDataList[key];
                    if (value.spawnLocations?.includes(locationId) && value.spawnChance != null) {
                        availableItems.push(value);
                        totalProbability += value.spawnChance;
                    }
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
                    this.addItem(new Item(availableItem));
                }
            }
        }
    }
    */
    showContainerContents(): string {
        let contentsString = '';

        this.items.forEach((quantity, item) => {
            contentsString += quantity + ' ' + item.name + '<span class="float-right">' + item.sellPrice + '</span></br>';

        });
        return contentsString;
    }

}