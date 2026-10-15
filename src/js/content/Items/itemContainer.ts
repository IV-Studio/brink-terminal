import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { playerCredits } from "../Player/credits";
import { Item } from "./items";
import getSMInstance from "../../statemanager.js";

const SM = getSMInstance();

export class ItemContainer {
    items: Map<Item, number>;
    capacity?: number;

    constructor(capacity?: number) {
        this.items = new Map<Item, number>();
        this.capacity = capacity;
    }

    addItem(item: Item, quantity: number = 1): boolean {
        if (this.capacity !== undefined && this.getTotalQuantity() + quantity > this.capacity) {
            console.log("Cannot add items: capacity reached");
            return false;
        }

        let itemToUpdate: Item | undefined;

        // Find the item with the given ID
        this.items.forEach((value, containerItem) => {
            if (containerItem.id === item.id) {
                itemToUpdate = containerItem;
            }
        });
        if (itemToUpdate) {
            // Update the number of the item
            const currentNumber = this.items.get(itemToUpdate);
            if (currentNumber !== undefined) {
                this.items.set(itemToUpdate, currentNumber + quantity);
            }
        } else {
            // Handle case where item with the given ID is not found
            this.items.set(item, quantity);
        }
        return true;
    }

    removeItem(item: Item, quantity: number = 1): boolean {
        if (!this.items.has(item)) {
            console.log("Item not found in the container");
            return false;
        }

        const currentQuantity = this.items.get(item)!;
        if (currentQuantity < quantity) {
            console.log("Not enough items to remove");
            return false;
        }

        if (currentQuantity === quantity) {
            this.items.delete(item);
        } else {
            this.items.set(item, currentQuantity - quantity);
        }
        return true;
    }

    getTotalQuantity(): number {
        let total = 0;
        this.items.forEach((quantity) => {
            total += quantity;
        });
        return total;
    }

    getSpaceRemaining(): number {
        if (this.capacity == null) {
            return Number.MAX_VALUE;
        } else {
            return this.capacity - this.getTotalQuantity();
        }
    }

    getItemByCommand(command: string): Item | undefined {
        let returnItem: Item | undefined;

        this.items.forEach((quantity, item) => {
            if (item.command.includes(command)) {
                returnItem = item;
            }
        });
        return returnItem;
    }

    getItemQuantity(item: Item): number {
        return this.items.get(item) || 0;
    }


    showContainerContents(showQuantity, showSellPrice, showBuyPrice): string {
        let contentsString = '';

        if (SM.checkCurrentState('supply')) {
            this.items.forEach((quantity, item) => {
                if (showQuantity) {
                    contentsString += quantity + ' ' + item.name + '<span class="float-right">' + item.sellPrice + '</span></br>';
                } else {
                    contentsString += item.name + '<span class="float-right">' + item.sellPrice + '</span></br>';
                }
                
            });

        } else {
            this.items.forEach((quantity, item) => {
                contentsString += ' ' + item.name + '<span class="float-right">' + quantity + '</span></br>';
            });
        }

        return contentsString;
    }

    getContainerActions(): { [key: string]: CommandConfig } {

        const actions: { [key: string]: CommandConfig } = {};

        return actions;
    }

    useItem(commandBase: string, fullCommand: string) {
        const parts = fullCommand.split(' ');
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid Use command.');
            return;
        }

        const itemCommand = parts.slice(1).join(' ');
        let item = this.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid item.');
            return;
        }

        if (item.use == undefined) {
            Command.addCommandResponse('Error: Item cannot be used.');
        } else {
            Command.addCommandResponse('Using ' + item.name);
            item.use();
            this.removeItem(item, 1);
        }
    }

    transferItems(sourceContainer: ItemContainer, targetContainer: ItemContainer, commandBase: string, fullCommand: string) {

        const parts = fullCommand.split(' ');

        // Check if command is accurate
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const quantityCommand = parseInt(parts[1], 10);

        // check if part 2 is a number
        if (!Number.isInteger(quantityCommand)) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const itemCommand = parts.slice(2).join(' ');
        let item = sourceContainer.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid item. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        let numberOfItemsInContainers = 0;
        numberOfItemsInContainers = sourceContainer.getItemQuantity(item);

        if (quantityCommand > numberOfItemsInContainers) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        // Check if there is enough room
        if (targetContainer.getSpaceRemaining() < quantityCommand) {
            Command.addCommandResponse('Error: Destination container does not have enough room.');
            return;
        }

        // make the transfer
        sourceContainer.removeItem(item, quantityCommand);
        targetContainer.addItem(item, quantityCommand);
    }

    transferAllItems(source: ItemContainer, target: ItemContainer): void {
        source.items.forEach((quantity, item) => {
            if (target.capacity !== undefined && target.getTotalQuantity() + quantity > target.capacity) {
                console.log(`Cannot transfer ${quantity} of ${item.name}: capacity reached in target container`);
                return;
            }

            if (source.removeItem(item, quantity)) {
                if (!target.addItem(item, quantity)) {
                    // If adding to target fails (though it shouldn't in this flow), add back to source
                    source.addItem(item, quantity);
                }
            } else {
                console.log(`Failed to remove ${quantity} of ${item.name} from source container`);
            }
        });
    }

    eject(commandBase: string, fullCommand: string) {

        const parts = fullCommand.split(' ');

        // Check if command is accurate
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const quantityCommand = parseInt(parts[1], 10);

        // check if part 2 is a number
        if (!Number.isInteger(quantityCommand)) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const itemCommand = parts.slice(2).join(' ');
        let item = this.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid item. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        let numberOfItemsInContainers = 0;
        numberOfItemsInContainers = this.getItemQuantity(item);

        if (quantityCommand > numberOfItemsInContainers) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        Command.addCommandResponse('Ejected ' + quantityCommand + ' ' + item.name + '.');

        this.removeItem(item, quantityCommand);
    }

    buyItems(sourceContainer: ItemContainer, targetContainer: ItemContainer, commandBase: string, fullCommand: string) {

        console.log('attempting to buy an item');
        const parts = fullCommand.split(' ');

        // Check if command is accurate
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const quantityCommand = parseInt(parts[1], 10);

        // check if part 2 is a number
        if (!Number.isInteger(quantityCommand)) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const itemCommand = parts.slice(2).join(' ');
        let item = sourceContainer.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid item. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        let numberOfItemsInContainers = 0;
        numberOfItemsInContainers = sourceContainer.getItemQuantity(item);

        if (quantityCommand > numberOfItemsInContainers) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const cost = quantityCommand * item.purchasePrice;
        // Check if the player has enough money
        if (playerCredits.getAmount() < cost) {
            playerCredits.messageInsufficientCredits();
            return;
        }

        // Check if there is enough room
        if (targetContainer.getSpaceRemaining() < quantityCommand) {
            Command.addCommandResponse('Error: Destination container does not have enough room.');
            return;
        }

        Command.addCommandResponse('Purchased ' + item.name + ' for ' + cost + ' credits.');

        // make the transfer
        sourceContainer.removeItem(item, quantityCommand);
        targetContainer.addItem(item, quantityCommand);
        playerCredits.spend(cost);
    }

    sellItems(sourceContainer: ItemContainer, commandBase: string, fullCommand: string) {

        const parts = fullCommand.split(' ');

        // Check if command is accurate
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }
        const quantityCommand = parseInt(parts[1], 10);

        // check if part 2 is a number
        if (!Number.isInteger(quantityCommand)) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        const itemCommand = parts.slice(2).join(' ');
        let item = sourceContainer.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid item. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        let numberOfItemsInContainers = 0;
        numberOfItemsInContainers = sourceContainer.getItemQuantity(item);

        if (quantityCommand > numberOfItemsInContainers) {
            Command.addCommandResponse('Error: Invalid quantity. To ' + commandBase + ' specific items enter [' + commandBase + ' 2 item].');
            return;
        }

        const sellPrice = quantityCommand * item.sellPrice;

        /*
        // Check if there is enough room
        if (targetContainer.getSpaceRemaining() < quantityCommand) {
            Command.addCommandResponse('Error: Destination container does not have enough room.');
            return;
        }
        */

        Command.addCommandResponse('Sold ' + item.name + ' for ' + sellPrice + ' credits.');
        // make the transfer
        sourceContainer.removeItem(item, quantityCommand);
        playerCredits.gain(sellPrice);
    }

    sellAllItems(source: ItemContainer): void {
        source.items.forEach((quantity, item) => {
            if (source.removeItem(item, quantity)) {
                playerCredits.gain(quantity * item.sellPrice);
            } else {
                console.log(`Failed to sell ${quantity} of ${item.name} from source container`);
            }
        });
    }

    removeAllItems(): void {
        this.items.forEach((quantity, item) => {
            this.removeItem(item, quantity);
        });
    }
}
