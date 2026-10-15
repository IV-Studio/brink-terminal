
import { updateRiveMapTiles, enterCombat as enterCombatRive, exitCombat as exitCombatRive, riveCombatPlayerAttack, rivePlayerTurn, riveEnemyTurn, rivePlayerText, riveEnemyText } from '../../riveMap';
import { playerShip } from '../Ship/ships';
import { CommandConfig } from '../Interfaces/commands';
import Actions, { sendCombatCommandToServer } from '../../actions';
import getSMInstance from '../../statemanager';
import Command from '../../command';
import { world } from '../Map/world';
import { createEnemyById, Enemy, EnemyId } from './enemies';
import { AttackAction } from './combatActions';
import { ShipPart } from '../Ship Parts/shipParts';

const SM = getSMInstance();

export class Combat {

    public turn: number;
    public currentEnemy: Enemy | undefined;
    public combatActive: boolean;

    public playerTurn: boolean;

    constructor() {
        this.turn = 0;
        this.combatActive = false;
    }

    actions = {
        title: "--COMBAT--",
        errorMessage: "Error: Did not recognize command.",
        state: 'combat',

        actionTitle: (): string => '--COMBAT--',
        displayTitle: (): string => 'Combat Actions',
        onEntry: (): void => {
            this.playerTurn = true;
            rivePlayerTurn.value = true;
            riveEnemyTurn.value = false;
            if (this.currentEnemy) {
                riveEnemyText.text = this.currentEnemy?.name;
            }
            rivePlayerText.text = "You";
            
        },
        onExit: (): void => {
            riveEnemyText.text = '';
            rivePlayerText.text = '';
        },
        entryCommandMessage: (): string => '<hr>You\'ve entered combat',
        entryDisplayMessage: (): string => '',
        additionalActions: (): any[] => [],
        available: function (): boolean {
            return true;
        },
        getActionList: function (): any {
            const commands = this.commands || {};

            // Combine the actions while making sure all components are valid objects
            const combinedList = {
                ...commands
            };

            return combat.commands;
        }
    };

    commands: { [key: string]: CommandConfig } = {
        enemyTurn: {
            command: function (command) {
                return [''].includes(command);
            },
            displayName: 'Enemy Turn<br>[Press Enter]',
            section: 'combat',
            available: (): boolean => {
                return !this.playerTurn;
            },
            action: (): void => {
                this.enemyTakeTurn();
            }
        },
        attack: {
            command: function (command) {
                return ['attack', 'a'].includes(command);
            },
            displayName: '[A]ttack',
            section: 'combat',
            available: (): boolean => {
                return this.playerTurn;
            },
            action: (): void => {
                this.playerAttackAction();
            }
        },
        shield: {
            command: function (command) {
                return ['shield', 's'].includes(command);
            },
            displayName: '[S]hield',
            section: 'combat',
            available: (): boolean => {
                if (this.checkForShieldAction() && this.playerTurn) {
                    return true;
                } else {
                    return false;
                }
            },
            action: (): void => {
                this.playerShieldAction();
            }
        },
        reactor: {
            command: function (command) {
                return ['reactor', 'r'].includes(command);
            },
            displayName: '[R]eactor',
            section: 'combat',
            available: (): boolean => {
                if (this.checkForReactorAction() && this.playerTurn) {
                    return true;
                } else {
                    return false;
                }
            },
            action: (): void => {
                this.playerReactorAction();
            }
        },
        thruster: {
            command: function (command) {
                return ['thruster', 't'].includes(command);
            },
            displayName: '[T]hruster',
            section: 'combat',
            available: (): boolean => {
                if (this.checkForThrusterAction() && this.playerTurn) {
                    return true;
                } else {
                    return false;
                }
            },
            action: (): void => {
                this.playerThrusterAction();
            }
        },
        escape: {
            command: function (command) {
                return ['escape', 'e'].includes(command);
            },
            displayName: '[E]scape',
            section: 'combat',
            available: () => this.playerTurn,
            action: (): void => {
                this.playerEscapeAction();
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
        enemy: {
            command: function () {
                return false;
            },
            displayName: function () {
                const currentEnemy = combat.currentEnemy;
                if (currentEnemy) {
                    return currentEnemy.showShipData();
                } else {
                    return '';
                }
            },
            section: 'enemy',
            available: function () {
                return true;
            },
            action: function () {
            },
        },
    }

    public playerEscapeAction(): void {

        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onEscapeAction) {
                    shipPart.shipPartData.onEscapeAction();
                }
            }
        });

        Command.addCommandResponse("Escape Chance = " + playerShip.getEscapeChance() * 100 + "%<br>");

        if (Math.random() < playerShip.getEscapeChance()) {
            Command.addCommandResponse("Escaped successfully.");
            this.exitCombat();
        } else {
            Command.addCommandResponse("Attempt to escape failed.");
            this.endPlayerTurn();
        }

    }

    public playerAttackAction(): void {
        let baseAttackValue = playerShip.attackLevels[playerShip.attackLevel].amount;

        let attackAction = new AttackAction({ damageAmount: baseAttackValue, hitPercentageChance: 0.7 });

        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onAttackAction) {
                    if (this.currentEnemy) {
                        attackAction = shipPart.shipPartData.onAttackAction(attackAction, playerShip, this.currentEnemy);
                    }
                }
            }
        });

        this.currentEnemy?.attack(attackAction);
        riveCombatPlayerAttack.fire();
        this.endPlayerTurn();
    }

    public checkForShieldAction(): boolean {
        let shieldAction = false;
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onShieldAction) {
                    shieldAction = true;
                }
            }
        });

        return shieldAction;
    }

    public playerShieldAction(): void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onShieldAction) {
                    shipPart.shipPartData.onShieldAction(playerShip);
                }
            }
        });
        this.endPlayerTurn();
    }

    public checkForReactorAction(): boolean {
        let reactorAction = false;
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onReactorAction) {
                    reactorAction = true;
                }
            }
        });

        return reactorAction;

    }

    public playerReactorAction(): void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onReactorAction) {
                    shipPart.shipPartData.onReactorAction(playerShip);
                }
            }
        });
        this.endPlayerTurn();
    }

    public checkForThrusterAction(): boolean {
        let thrusterAction = false;
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onThrusterAction) {
                    thrusterAction = true;
                }
            }
        });

        return thrusterAction;
    }

    public playerThrusterAction(): void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onThrusterAction) {
                    shipPart.shipPartData.onThrusterAction(playerShip);
                }
            }
        });
        this.endPlayerTurn();
    }

    public enemyDestroyed(): void {
        sendCombatCommandToServer(this.currentEnemy?.id)
        this.exitCombat();
        if (this.currentEnemy?.id == EnemyId.GENERAL_GARDA) {
            Command.addCommandResponse('You defeat the UA general. The aggressive encounter has left you rattled, but this dangerous incursion into enemy territory is well worth it because you\'ve recovered something invaluable from the wreckage of the general\'s ship--the map fragment Meg spoke of.<br><br>' +
            'This must have been the same UA officer who captured the Sorelian agent previously. You\'re now in possession of something the UA (and other Moonrakers) have killed for. Be careful.<br><br>' +
            'It would be wise to exit UA space as soon as possible.<br><br>' +
            'To open the file, enter the passcode: INSIDER-B7X')
        }
    }

    public checkIfPlayerDestroyed(): void {
        if (playerShip.currentHealth <= 0) {
            this.exitCombat();
        }
    }

    public enterCombat(enemyId: string | null): void {
        this.combatActive = true;
        if (enemyId != null) {
            this.turn = 0;
            this.currentEnemy = createEnemyById(enemyId);
            Actions.changeActionState(this.actions.state);
            //updateRiveMapTiles();
            enterCombatRive();
        }

        this.currentEnemy?.onCombatBegin();
        playerShip.onCombatBegin();
    }

    public exitCombat(): void {
        this.combatActive = false;

        this.currentEnemy?.onCombatEnd();
        playerShip.onCombatEnd();

        world.map.removeEnemyFromTile();

        if(playerShip.currentHealth > 0) {
            Actions.changeActionState(world.actions.state);
            updateRiveMapTiles();
            
        } else {
            
            playerShip.deathTransitionToStation();
        }
        exitCombatRive();
    }

    public endPlayerTurn(): void {
        this.checkIfPlayerDestroyed();

        if (this.combatActive) {

            this.checkIfPlayerDestroyed();

            if (this.combatActive) {

                playerShip.onTurnEnd();
                this.nextTurn();
            }
        }
    }

    private enemyTakeTurn (): void {
        Command.addCommandResponse('<hr>');
        this.currentEnemy?.onTurnBegin();
        this.currentEnemy?.takeTurn();
        this.endEnemyTurn();
    }

    private endEnemyTurn(): void {
        this.currentEnemy?.onTurnEnd();
        this.checkIfPlayerDestroyed();
        if (this.combatActive) {
            this.nextTurn();
        }

    }

    private nextTurn(): void {

        this.playerTurn = !this.playerTurn;

        if (this.combatActive) {
            this.turn++;
            if (this.playerTurn) {
                playerShip.onTurnBegin();
                rivePlayerTurn.value = true;
                riveEnemyTurn.value = false;
            } else {
                rivePlayerTurn.value = false;
                riveEnemyTurn.value = true;
                // player will trigger the enemy's turn.
            }
            
        }

    }


}

export let combat: Combat;
export function initializeCombat() {
    return combat ??= new Combat();
}