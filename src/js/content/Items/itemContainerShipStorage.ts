import Command from "../../command";
import { CommandConfig } from "../Interfaces/commands";
import { world } from "../Map/world";
import { ItemContainer } from "./itemContainer";
import getSMInstance from "../../statemanager.js";
import { itemStorageTitle } from "./items";

const SM = getSMInstance();

export class ItemContainerShipStorage extends ItemContainer {

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
                let displayString =  '';
                const inSupplyDepot = SM.checkCurrentState('supply');

                if (this.getTotalQuantity() > 0) {
                    if (inSupplyDepot) {
                        displayString += "<span class='read'>" + 'Items<span class="float-right">Sell Price</span>' + '</span><br>';
                    }

                    displayString += this.showContainerContents() + '<hr class="dark">';

                    if (inSupplyDepot) {
                        displayString += '[Sell] [Info]';
                    } else {
                        displayString += '[Use] [Eject] [Info]';
                    }
                }

                
                return displayString;
            },
            section: itemStorageTitle(),
            available: () => true,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'eject') {
                    Command.addCommandResponse('To eject all items from your cargo hold, enter [Eject All], or to eject specific items enter [Eject 2 Iron].');
                } else if (command == 'eject all') {
                    const currentTile = world.map.getCurrentTile();
                    if (currentTile != null) {
                        this.transferAllItems(this, currentTile.lootContainer);
                    }
                } else if (parts[0] === 'eject') {
                    this.eject('eject', command);
                } else if (command == 'use') {
                    Command.addCommandResponse('To attempt to use an item, enter the use command paired with the item you\'re trying to use. For example, [Use Water].');
                } else if (parts[0] === 'use') {
                    this.useItem('use', command);
                } else if (command == 'sell') {
                    Command.addCommandResponse('To attempt to sell an item, enter [Sell All], or to sell specific items enter [Sell 2 Iron].');
                } else if (command == 'sell all') {
                    this.sellAllItems(this);
                } else if (parts[0] === 'sell') {
                    this.sellItems(this, 'sell', command);
                }
            },
        };

        actions.storage = storageCommands;

        return actions;
    }

    showContainerContents(): string {
        let contentsString = '';

        if (SM.checkCurrentState('supply')) {
            this.items.forEach((quantity, item) => {
                contentsString += quantity + ' ' + item.name + '<span class="float-right">' + item.sellPrice + '</span></br>';
            });
        } else {
            this.items.forEach((quantity, item) => {
                contentsString += ' ' + item.name + '<span class="float-right">' + quantity + '</span></br>';
            });
        }

        return contentsString;
    }

}