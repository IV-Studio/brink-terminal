import Command from "../../command";
import { playerShip } from "../Ship/ships";
import { ItemData, itemDataList } from "./itemList";

export class Item {
    id: string;
    name: string;
    command: string[];
    description: string;
    sellPrice: number;
    purchasePrice: number;
    spawnChance?: number;
    spawnLocations?: number[];
    useFunction?: () => void;

    constructor(itemData: ItemData) {
        this.id = itemData.id;
        this.name = itemData.name;
        this.description = itemData.description;
        this.command = itemData.command;
        this.sellPrice = itemData.sellPrice;
        this.purchasePrice = itemData.purchasePrice;
        this.spawnChance = itemData.spawnChance;
        this.spawnLocations = itemData.spawnLocations,
        this.useFunction = itemData.useFunction;
    }

    use(): void {
        if (this.useFunction) {
            this.useFunction();
        } else {
            console.log(`${this.name} cannot be used.`);

        }
    }
}

export function itemStorageTitle() {
    return 'Ship Storage <span class="float-right">' + playerShip.itemContainer.getTotalQuantity() + ' / ' + playerShip.itemContainer.capacity + '</span>';
};

export function createItemsFromOptions(options: { [key: string]: ItemData }): { [key: string]: Item } {
    const items: { [key: string]: Item } = {};
    for (const key in options) {
        items[key] = new Item(options[key]);
    }
    return items;
};

export function createItemById(id: string): Item | null {
    const itemData = itemDataList[id];
    if (itemData) {
        return new Item(itemData);
    } else {
        console.error(`Item with ID '${id}' not found.`);
        return null;
    }
};

function findItemByCommand(command: string): ItemData | undefined {
    for (const key in itemDataList) {
        const item = itemDataList[key];
        if (item.command.includes(command)) {
            return item;
        }
    }

    return undefined;
}

export function getItemInfo(commandBase: string, fullCommand: string) {

    const parts = fullCommand.split(' ');
    if (parts[0] != commandBase) {
        //Command.addCommandResponse('Error: Invalid Info command.');
        return false;
    }
    const itemCommand = parts.slice(1).join(' ');
    let item = findItemByCommand(itemCommand);

    // Check if item exists
    if (item == undefined) {
        //Command.addCommandResponse('Error: Invalid item.');
        return false;
    }

    if (item.description == undefined) {
        Command.addCommandResponse('Error: Item has no description.');
        return true;
    } else {
        Command.addCommandResponse(item.description);
        return true;
    }
}




