import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { world } from "../Map/world";
import { ItemContainer } from "./itemContainer";
import getSMInstance from "../../statemanager.js";
import { shipPartsTitle } from "../Ship Parts/shipParts";
import Rooms from "../rooms";
import { playerCredits } from "../Player/credits";

const SM = getSMInstance();

export class ItemContainerShipParts extends ItemContainer {

    constructor(capacity?: number) {
        super(capacity);
    }

    getContainerActions(): { [key: string]: CommandConfig } {
        const actions: { [key: string]: CommandConfig } = super.getContainerActions();

        const storageCommands: CommandConfig = {
            command: (command) => {
                const parts = command.split(' ');
                return (['eject', 'eject all', 'use', 'sell', 'sell all'].includes(command) || parts[0] === 'use' || parts[0] === 'eject' || parts[0] === 'sell');
            },
            displayName: () => {
                let displayString = '';

                const inArmory = ((Rooms.getCurrentRoomKey() === 'armory') && (SM.checkCurrentState('room')));
                //
                if (this.getTotalQuantity() > 0) {
                    if (inArmory) {
                        displayString += "<span class='read'>" + 'Ship Parts<span class="float-right">Sell Price</span>' + '</span><br>';
                    }

                    displayString += this.showContainerContents() + '<hr class="dark">';

                    if (inArmory) {
                        displayString += '[Sell] [Info]';
                    } else {
                        displayString += '[Use] [Eject] [Info]';
                    }
                }

                
                return displayString;
            },
            section: shipPartsTitle(),
            available: () => true,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'eject') {
                    Command.addCommandResponse('To eject a Ship Part, enter [Eject SHIP PART NAME].');
                } else if (parts[0] === 'eject') {
                    this.eject('eject', command);
                } else if (command == 'use') {
                    Command.addCommandResponse('To attempt to use an item, enter the use command paired with the item you\'re trying to use. For example, [Use Water].');
                } else if (parts[0] === 'use') {
                    this.useItem('use', command);
                } else if (command == 'sell') {
                    Command.addCommandResponse('To sell a ship part, enter [Sell SHIP PART NAME].');
                } else if (parts[0] === 'sell') {
                    this.sellShipParts(this, 'sell', command);
                }
            },
        };

        actions.storage = storageCommands;

        return actions;
    }

    showContainerContents(): string {
        let contentsString = '';

        let itemCount = this.items.size;
        let currentIndex = 0;

        if ((Rooms.getCurrentRoomKey() === 'armory') && (SM.checkCurrentState('room'))){
            this.items.forEach((quantity, item) => {
                contentsString +=  item.name + '<span class="float-right">' + item.sellPrice + '</span>';
                if (currentIndex < itemCount - 1) {
                    contentsString += '</br>';
                }
                currentIndex++;
            });
        } else {

            this.items.forEach((quantity, item) => {
                contentsString += item.name;
                if (currentIndex < itemCount - 1) {
                    contentsString += '</br>';
                }
                currentIndex++;
            });
        }

        return contentsString;
    }

    sellShipParts(sourceContainer: ItemContainer, commandBase: string, fullCommand: string) {

        
        const parts = fullCommand.split(' ');
    
        // The first word
        const firstWord = parts[0];
    
        // The rest of the words joined back into a string
        const itemCommand = parts.slice(1).join(' ');

        // Check if command is accurate
        if (parts[0] != commandBase) {
            Command.addCommandResponse('Error: Invalid ' + commandBase + ' command. To ' + commandBase + ' specific items enter [' + commandBase + ' SHIP PART NAME].');
            return;
        }

        let item = sourceContainer.getItemByCommand(itemCommand);

        // Check if item exists
        if (item == undefined) {
            Command.addCommandResponse('Error: Invalid ship part. To ' + commandBase + ' ship parts enter [' + commandBase + ' SHIP PART NAME].');
            return;
        }


        const sellPrice = item.sellPrice;

        Command.addCommandResponse('Sold ' + item.name + ' for ' + sellPrice + ' credits.');
        // make the transfer
        sourceContainer.removeItem(item, 1);
        playerCredits.gain(sellPrice);
    }

}