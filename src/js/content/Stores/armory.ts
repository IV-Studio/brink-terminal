import Actions from "../../actions";
import { CommandConfig } from "../Interfaces/commands";
import { ItemContainerStore } from "../Items/itemContainerStore";
import { playerShip } from "../Ship/ships";
import Station from "../station";
import { getItemInfo, Item } from "../Items/items";
import { createShipPartById, getShipPartInfo, ShipPart, ShipPartData, ShipPartKeys, shipPartList, showShipPartData } from "../Ship Parts/shipParts";
import { ItemContainerArmory } from "../Items/itemContainerArmory";
import { world } from "../Map/world";
import Command from "../../command";

export class Armory {

    private currentStore: ItemContainerStore;

    private lastUpdatedOnDay = -10;

    getActionList() {
        const storeActions = armory.currentStore?.getContainerActions() || {};
        const shipPartsContainer = playerShip.shipPartContainer?.getContainerActions() || {};
        const combinedList = {
            ...armory.commands,
            ...shipPartsContainer,
            ...storeActions
        };

        return combinedList;
    };

    commands: { [key: string]: CommandConfig } = {
        leave: {
            command: function (command) {
                return ['exit', 'x'].includes(command);
            },
            displayName: 'E[x]it',
            section: 'Actions',
            available: function () {
                return true;
            },
            action: function () {
                Actions.changeActionState(Station.Actions.state);
            },
        },
        info: {
            command: function (command) {
                const parts = command.split(' ');
                return (parts[0] === 'info');
            },
            hidden: function () {
                return true;
            },
            displayName: function () {
                return '';
            },
            section: 'Actions',
            available: function () {
                return true;
            },
            action: function (command) {
                let gotInfo = getItemInfo('info', command);
                if (gotInfo == false) {
                    if (command == 'info all') {
                        armory.getInfoAll();
                    } else {
                        getShipPartInfo('info', command);
                    }
                    
                }
            },
        }
    }
    getInfoAll() {
        Command.addCommandResponse("Showing all Ship Part info.");
        console.log(this.currentStore.getTotalQuantity() + 'total items ' + this.currentStore.items.size);

        this.currentStore.items.forEach((quantity, item) => {
            const shipPart = item as ShipPart;
            Command.addCommandResponse(showShipPartData(shipPart.shipPartData));
        });

    }
    // This is run in the station every time you enter.
    setupArmory() {

        if (world.day > this.lastUpdatedOnDay + 7) {
            this.updateStoreSelection();
        }

        const debugShipParts = [ShipPartKeys.DABURU_MK1];

        debugShipParts.forEach(debugPart => {
            const part = createShipPartById(debugPart);
            if (part != null) {
                this.currentStore.addItem(part, 1);
            }

        });
    }

    updateStoreSelection() {

        this.lastUpdatedOnDay = world.day;

        this.currentStore = new ItemContainerArmory();

        const shipParts = this.getPotentialShipParts(shipPartList, 1, 5);

        shipParts.forEach(part => {
            const shipPart = createShipPartById(part.id);
            if (shipPart != null) {
                this.currentStore.addItem(shipPart, 1);
            }
        });

    }
    getRandomElements<T>(arr: T[], count: number): T[] {
        const shuffled = arr.slice();
        let i = arr.length;
        let temp: T;
        let index: number;

        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }

        return shuffled.slice(0, count);
    }

    getPotentialShipParts(shipParts: { [key: string]: ShipPartData }, maxQualityLevel: number, quantity: number): ShipPartData[] {
        const potentialParts = Object.values(shipParts).filter(part => part.qualityLevel <= maxQualityLevel);
        return this.getRandomElements(potentialParts, quantity);
    }

}

export const armory = new Armory();