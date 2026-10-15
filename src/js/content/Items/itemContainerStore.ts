import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { playerShip } from "../Ship/ships";
import { ItemContainer } from "./itemContainer";
import { playerCredits } from "../Player/credits";
import getSMInstance from "../../statemanager.js";

const SM = getSMInstance();

export class ItemContainerStore extends ItemContainer {

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
                    return "<span class='read'>" + 'Item<span class="float-right">Cost</span>' + "</span><br>"  + this.showContainerContents() + '<hr class="dark">[Buy] [Info]' + playerCredits.showCurrentCredits();
                } else {
                    return '';
                }
            },
            section: 'Store',
            available: () => true,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'buy') {
                    Command.addCommandResponse('To buy an item, enter the quantity and name of the item. For example [Buy 1 Fuel Cell].');
                    
                } else if (parts[0] === 'buy') {
                    this.buyItems(this, playerShip.itemContainer, 'buy', command);
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

}