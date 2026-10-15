import Command from "../../command.js";
import { CommandConfig } from "../Interfaces/commands.js";
import { playerShip } from "../Ship/ships";
import { ItemContainer } from "./itemContainer";
import { playerCredits } from "../Player/credits";
import getSMInstance from "../../statemanager.js";

const SM = getSMInstance();

export class ItemContainerArmory extends ItemContainer {

    constructor(capacity?: number) {
        super(capacity);
    }

    getContainerActions(): { [key: string]: CommandConfig } {
        const actions: { [key: string]: CommandConfig } = super.getContainerActions();

        const storeCommand: CommandConfig = {
            command: (command) => {
                const parts = command.split(' ');
                return (['buy'].includes(command) || parts[0] === 'buy');
            },
            displayName: () => {
                if (this.getTotalQuantity() > 0) {
                    return "<span class='read'>" + 'Item<span class="float-right">Cost</span>' + "</span><br>"  + this.showContainerContents() + '<hr class="dark">[Buy] [Info] [Info All]' + playerCredits.showCurrentCredits();
                } else {
                    return '';
                }
            },
            section: 'Store',
            available: () => true,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'buy') {
                    Command.addCommandResponse('To buy a ship part, enter [Buy SHIP PART NAME].');
                } else if (parts[0] === 'buy') {
                    this.buyShipPart(this, playerShip.shipPartContainer, 'buy', command);
                }
            }
        };

        actions.store = storeCommand;

        return actions;
    }

    showContainerContents(): string {
        let contentsString = '';

        this.items.forEach((quantity, item) => {
            contentsString += item.name + '<span class="float-right">' + item.purchasePrice + '</span></br>';
        });

        return contentsString;
    }

    buyShipPart(sourceContainer: ItemContainer, targetContainer: ItemContainer, commandBase: string, fullCommand: string) {

        const parts = fullCommand.split(' ');
    
        // The first word
        const firstWord = parts[0];
    
        // The rest of the words joined back into a string
        const itemCommand = parts.slice(1).join(' ');

        let item = sourceContainer.getItemByCommand(itemCommand);

        // Check if command is accurate
        if (firstWord != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' SHIP PART NAME].');
            return;
        }
        
        // Check if item exists
        if (item == undefined) {
            console.log(itemCommand);
            Command.addCommandResponse('Error: Invalid item. To ' + commandBase + ' specific items enter [' + commandBase + ' SHIP PART NAME].');
            return;
        }

        let numberOfItemsInContainers = 0;
        numberOfItemsInContainers = sourceContainer.getItemQuantity(item);

        const cost = item.purchasePrice;
        // Check if the player has enough money
        if (playerCredits.getAmount() < cost) {
            playerCredits.messageInsufficientCredits();
            return;
        }

        // Check if there is enough room
        if (targetContainer.getSpaceRemaining() < 1) {
            Command.addCommandResponse('Error: Destination container does not have enough room.');
            return;
        }

        Command.addCommandResponse('Purchased ' + item.name + ' for ' + cost + ' credits.');

        // make the transfer
        sourceContainer.removeItem(item, 1);
        targetContainer.addItem(item, 1);
        playerCredits.spend(cost);
    }

}