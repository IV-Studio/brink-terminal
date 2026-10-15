import MapData from '../../mapData';
import { Map } from './map';
import { updateRiveMapTiles, turnOffMap } from '../../riveMap';
import { playerShip } from '../Ship/ships';
import { CommandConfig } from '../Interfaces/commands';
import Actions from '../../actions';
import getSMInstance from '../../statemanager';
import { getItemInfo } from '../Items/items';
import { combat } from '../Combat/combat';
import { getShipPartInfo, shipPartsTitle } from '../Ship Parts/shipParts';
import Command from '../../command';
const SM = getSMInstance();

export class World {
    public readonly map: Map;
    public day: number;

    constructor() {
        this.map = new Map();
        this.day = 0;
    }

    actions = {
        title: "--EXPLORE--",
        errorMessage: "Error: Did not recognize command.",
        state: 'world',
        actionTitle: (): string => '--EXPLORE--',
        displayTitle: (): string => 'Explore Actions',
        onEntry: (): void => {
            if (SM.getPreviousState() == 'combat') {
                this.enterWorldFromCombat();
            } else {
                this.enterWorld();
            }
            
        },
        onExit: (): void => {
            // No operation for onExit
        },
        entryCommandMessage: (): string => '<hr>All systems check. Ready to explore.',
        entryDisplayMessage: (): string => '',
        additionalActions: (): any[] => [],
        available: function (): boolean {
            return true;
        },
        getActionList: function (): any {
            const commands = world.commands || {};
            const shipActions = playerShip.itemContainer?.getContainerActions() || {};
            const tileActions = world.map?.getCurrentTileActions() || {};

            // Combine the actions while making sure all components are valid objects
            const combinedList = {
                ...commands,
                ...shipActions,
                ...tileActions
            };

            return combinedList;
        }
    };

    commands: { [key: string]: CommandConfig } = {
        north: {
            command: function (command) {
                return ['w', 'up'].includes(command);
            },
            displayName: '[W] ↑ [A] ← [S] ↓ [D] →',
            section: 'navigation',
            available: () => true,
            action: (): void => {
                this.move('up');
            }
        },
        west: {
            command: function (command) {
                return ['a', 'left'].includes(command);
            },
            displayName: '[A] Left',
            section: 'navigation',
            available: () => true,
            hidden: () => true,
            action: (): void => {
                this.move('left');
            }
        },
        south: {
            command: function (command) {
                return ['s', 'down'].includes(command);
            },
            displayName: '[S] Down',
            section: 'navigation',
            available: () => true,
            hidden: () => true,
            action: (): void => {
                this.move('down');
            }
        },
        east: {
            command: function (command) {
                return ['d', 'right'].includes(command);
            },
            displayName: '[D] Right',
            section: 'navigation',
            available: () => true,
            hidden: () => true,
            action: (): void => {
                this.move('right');
            }
        },
        ship: {
            command: function () {
                return false;
            },
            displayName: function () {
                return playerShip.showShipData();
            },
            section: 'ship',
            available: function () {
                return true;
            },
            action: function () {
            },
        },
        shipParts: {
            command: function () {
                return false;
            },
            displayName: function () {
                return playerShip.shipPartContainer.showContainerContents();
            },
            get section() { return shipPartsTitle(); },
            available: function () {
                return (playerShip.shipPartContainer.getTotalQuantity() > 0);
            },
            action: function () {
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
            section: 'ship',
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

    public move(direction: 'up' | 'down' | 'left' | 'right') {
        
        const movedSuccessfully = this.map.move(direction);

        if (movedSuccessfully) {
            playerShip.onShipMove();
            this.day++;

            const currentTile = this.map.getCurrentTile();

            if (currentTile?.attributes.attributes.includes('mine')) {
                Command.addCommandResponse('HAZARD ALERT: SORELIAN MINE DETECTED');
                playerShip.modifyHealth(-100);
            }

            if (this.map.currentTileSet.col == -1 && this.map.currentTileSet.row == -1) {
                if (Math.random() > 0.5) {
                    Command.addCommandResponse('WARNING: DANGEROUS RADIATION LEVELS');
                    playerShip.modifyHealth(-1);
                }
            }

            if (currentTile?.enemy) {
                combat.enterCombat(currentTile.enemy);
            }
        }

        if (SM.checkCurrentState('world')) {
            updateRiveMapTiles();
        }

        Actions.refreshCurrentActions();
    }

    public enterWorld(): void {
        this.map.exploreSurroundingTiles(this.map.currentLocation);
        this.map.refreshLoot();
        this.map.spawnEnemies();
        playerShip.onTakeoff();
        updateRiveMapTiles();
    }

    public enterWorldFromCombat(): void {
        this.map.exploreSurroundingTiles(this.map.currentLocation);
        playerShip.rechargeShields();
        updateRiveMapTiles();
    }

    public exitWorld(): void {
        turnOffMap();
    }

    

}

export const world = new World();