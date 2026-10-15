import Actions from "../../actions";
import { CommandConfig } from "../Interfaces/commands";
import { ItemContainerStore } from "../Items/itemContainerStore";
import { createItemById} from "../Items/items";
import { playerShip } from "../Ship/ships";
import Station from "../station";
import { getItemInfo } from "../Items/items";
import { itemDataList, ItemKeys } from "../Items/itemList";
import { getShipPartInfo } from "../Ship Parts/shipParts";

export class SupplyDepot {

    private currentStore: ItemContainerStore;

    constructor() {
        this.currentStore = new ItemContainerStore();
    }

    actions = {
        title: "--SUPPLY--",
        errorMessage: "Error: Did not recognize command.",
        state: 'supply',
        actionTitle: (): string => '--SUPPLY DEPOT--',
        displayTitle: (): string => 'Supply',
        onEntry: (): void => {
            supplyDepot.setupStore();
        },
        onExit: (): void => {
            
        },
        entryCommandMessage: (): string => '<hr>You enter the Supply Depot.',
        entryDisplayMessage: (): string => '',
        additionalActions: (): any[] => [],
        available: function (): boolean {
            return true;
        },
        getActionList: function (): any {
            // Combine the actions while making sure all components are valid objects
            const shipContainer = playerShip.itemContainer?.getContainerActions() || {};
            const storeActions = supplyDepot.currentStore?.getContainerActions() || {};
            const combinedList = {
                ...supplyDepot.commands,
                ...shipContainer,
                ...storeActions
            };

            return combinedList;
        }
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
                    getShipPartInfo('info', command);
                }
            },
        }
    }

    private setupStore() {

        this.currentStore = new ItemContainerStore();

        for (const key in itemDataList) {
            if (itemDataList.hasOwnProperty(key)) {
                const item = itemDataList[key];
                console.log(`Key: ${key}, Item: ${item.name}`);
                if (item.supplyDepotStation) {
                    if (item.supplyDepotStation.includes(Station.getStationId())) {
                        const itemToAdd = createItemById(item.id);
                        if (itemToAdd != null) {
                            this.currentStore.addItem(itemToAdd, 1000);
                        }   
                    }
                }
            }
        }

        const debugParts = [];

        debugParts.forEach(element => {
            const item = createItemById(element);
            if (item != null) {
                this.currentStore.addItem(item, 1000);
            }
        });
        /*
        const fuelCells = createItemById(ItemKeys.SMALL_FUEL_CELL);
        const repairNanoDroids = createItemById(ItemKeys.REPAIR_NANO_DROIDS);
        const missile = createItemById(ItemKeys.JAVELINE_MISSILE);

        if (fuelCells != null) {
            this.currentStore.addItem(fuelCells, 1000);
        }
        if (repairNanoDroids != null) {
            this.currentStore.addItem(repairNanoDroids, 1000);
        }
        if (missile != null) {
            this.currentStore.addItem(missile, 1000);
        }
        */
        
    }
}

export let supplyDepot: SupplyDepot;
export function initializeSupplyDepot() {
    return supplyDepot ??= new SupplyDepot();
}