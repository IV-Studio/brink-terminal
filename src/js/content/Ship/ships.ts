import Command from "../../command.js";
import { playerDamageTaken, riveEnemyHealthValue, riveEnemySheildValue, riveEnemyShieldOn, rivePlayerDamaged, rivePlayerHealthValue, rivePlayerSheildValue, rivePlayerShieldOn } from "../../riveMap";
import getSMInstance from "../../statemanager.js";
import { CommandConfig } from "../Interfaces/commands.js";
import { ItemContainerShipStorage } from "../Items/itemContainerShipStorage";
import { world } from "../Map/world";
import { playerCredits } from "../Player/credits";
import Station from "../station";
import { ShipPart } from "../Ship Parts/shipParts";
import { ItemContainerShipParts } from "../Items/itemContainerShipParts";
import { AttackAction } from "../Combat/combatActions";
import Clearance from "../clearance.js";

const SM = getSMInstance();

interface IUpgradeLevel {
    cost: number;
    amount: number;
    clearanceLevel: number;
}

export class Ship {

    name: string;
    currentHealth: number;
    currentReactor: number;
    currentShield: number;

    
    temporaryEvadeChance: number;
    evasionLoss: number;

    isPlayer: boolean;


    getBaseEvadeChance(): number {return 0};
    getTotalEvadeChance(): number { return this.getBaseEvadeChance() + this.temporaryEvadeChance }

    getEscapeChance(): number {return 0.5};

    getMaxHealth(): number { return 0; }
    getMaxShield(): number { return 0; }
    getMaxReactor(): number { return 0; }

    showIntent(): string { return '';}

    death(): void {}

    onTurnBegin() : void {}

    onTurnEnd() : void {
        this.decayEvasion();
    }
    

    onCombatBegin() : void {
        this.updateHealthUI();
        this.updateShieldUI();
    }
    onCombatEnd() : void {}
    
    onTakeDamage() : void {}
    onShieldLoss() : void {}

    // This is when this ship is attacked
    attack(attackAction: AttackAction) {
        console.log('being attacked. total evade chance = ' + this.getTotalEvadeChance());
        if (Math.random() < this.getTotalEvadeChance() ){ 
            Command.addCommandResponse('Evaded attack!');
        } else {
            if (attackAction.doesHit()) {
                const leftoverDamage = this.modifyShields(-attackAction.calculateEffectiveDamage());
                this.modifyHealth(-leftoverDamage);
            } else {
                Command.addCommandResponse('Attack missed!');
            }
        }
    }

    // Method to modify the ship's health.
    modifyHealth(amount: number): void {

        if (amount < 0) {
            this.onTakeDamage();
            Command.addCommandResponse(this.name + ' took ' + amount + ' damage.');
        } else if (amount > 0) {
            Command.addCommandResponse(this.name + ' has been repaired. Gained +' + amount + ' health.');
        }

        this.currentHealth += amount;
        if (this.currentHealth > this.getMaxHealth()) {
            this.currentHealth = this.getMaxHealth();
            
        } else if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.death();
        }

        this.updateHealthUI();
    }

    updateHealthUI (): void  {
        if (this.isPlayer) {
            rivePlayerHealthValue.value = 100 * this.currentHealth / this.getMaxHealth();
        } else {
            riveEnemyHealthValue.value = 100 * this.currentHealth / this.getMaxHealth();
        }
    }

    modifyShields(amount: number): number {

        let leftoverDamage = 0;

        if (amount < 0) {
            if (this.isPlayer) {
                playerDamageTaken();
                this.onShieldLoss();
            }
            if (this.currentShield > 0 && -amount < this.currentShield) {
                Command.addCommandResponse(this.name + ' lost ' + amount + ' shields.');
            } else if (this.currentShield > 0) {
                Command.addCommandResponse(this.name + ' lost ' + this.currentShield + ' shields.')
            }
        } else {
            Command.addCommandResponse(this.name + '\'s shields has been recharged. Gained +' + amount + ' shield.');
        }

        this.currentShield += amount;
        if (this.currentShield > this.getMaxShield()) {
            this.currentShield = this.getMaxShield();
            
        } else if (this.currentShield < 0) {
            leftoverDamage = this.currentShield * -1;
            this.currentShield = 0;
             
        }

        this.updateShieldUI();

        return leftoverDamage;
    }


    updateShieldUI (): void  {

        if (this.getMaxShield() > 0) {
            if (this.isPlayer) {
                rivePlayerShieldOn.value = true;
            } else {
                riveEnemyShieldOn.value = true;
            }
        } else {
            if (this.isPlayer) {
                rivePlayerShieldOn.value = false;
            } else {
                riveEnemyShieldOn.value = false;
            }
        }

        if (this.isPlayer) {
            rivePlayerSheildValue.value = 100 * this.currentShield / this.getMaxShield();
        } else {
            riveEnemySheildValue.value = 100 * this.currentShield / this.getMaxShield();
        }
    }

    

    showShipData() : string {

        const attack = 'Attack:<span class="float-right">' + playerShip.attackLevels[playerShip.attackLevel].amount + '</span>';
        const health = 'Health:<span class="float-right">' + this.currentHealth + ' / ' + this.getMaxHealth() + ' ' + generateBar(this.getMaxHealth(), this.currentHealth) + '</span>';
        const reactor = 'Reactor:<span class="float-right">' + this.currentReactor + ' / ' + this.getMaxReactor() + ' ' + generateBar(this.getMaxReactor(), this.currentReactor) +'</span>';
        const shield = 'Shield:<span class="float-right">' + this.currentShield + ' / ' + this.getMaxShield() + ' ' + generateBar(this.getMaxShield(), this.currentShield) + '</span>';

        /*
        let evasionPercentage = this.getBaseEvadeChance() * 100 + '%';
        if (this.temporaryEvadeChance > 0) {
            evasionPercentage += '+(' + this.temporaryEvadeChance * 100 + '%)';
        }
        */

        const evasion = 'Evade Chance:<span class="float-right">' + (Math.round(this.getBaseEvadeChance())) + '</span>';

        const br = '<br>';
        
        let returnString = health;

        
        if (this.getMaxShield() > 0) {
            returnString = shield + br + returnString;
        }

        if (Clearance.getClearanceLevel() >= 3 && this.isPlayer) {
            returnString = attack + br + returnString;
        }
    

        if (this.isPlayer) {
            returnString = returnString + br + reactor;
        }
        
        if (this.getTotalEvadeChance() > 0) {
            returnString = returnString + br + evasion;
        }

        if (!this.isPlayer) {
            returnString = returnString + br + this.showIntent();
        }

        return returnString;
    }

    decayEvasion() : void {
        this.temporaryEvadeChance -= this.evasionLoss;

        if (this.temporaryEvadeChance < 0) {
            this.temporaryEvadeChance = 0;
        }
    }
}



class PlayerShip extends Ship {
    maxHealthLevel: number;
    maxHealthLevels: IUpgradeLevel[];

    moveSpeed: number;

    reactorLevel: number;
    reactorLevels: IUpgradeLevel[];

    shipPartContainer: ItemContainerShipParts;
    itemContainer: ItemContainerShipStorage;

    storageLevel: number;
    storageLevels: IUpgradeLevel[];

    attackLevel: number;
    attackLevels: IUpgradeLevel[];

    shieldLevel: number;
    shieldLevels: IUpgradeLevel[];

    constructor(moveSpeed: number, shipParts: number, healthLevels: IUpgradeLevel[], reactorLevels: IUpgradeLevel[], storageLevels: IUpgradeLevel[], attackLevels: IUpgradeLevel[], shieldLevels: IUpgradeLevel[]) {
        super();

        this.moveSpeed = moveSpeed;
        
        this.maxHealthLevels = healthLevels;
        this.maxHealthLevel = 0;
        this.currentHealth = this.getMaxHealth();

        this.reactorLevels = reactorLevels;
        this.reactorLevel = 0;
        this.currentReactor = this.getMaxReactor();

        this.storageLevels = storageLevels;
        this.storageLevel = 0;
        this.itemContainer = new ItemContainerShipStorage(this.getStorageCapacity());

        this.shieldLevels = shieldLevels;
        this.shieldLevel = 0;
        this.currentShield = 0;

        this.attackLevels = attackLevels;
        this.attackLevel = 0;

        this.shipPartContainer = new ItemContainerShipParts(shipParts);

        this.evasionLoss = 0.1;
        this.temporaryEvadeChance = 0;
        
        this.name = 'Your ship';
        this.isPlayer = true;
       
    }
    

    getStorageCapacity(): number {
        let shipPartsModifier = 0;
        this.shipPartContainer?.items?.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.storageAmount) {
                    shipPartsModifier += shipPart.shipPartData.storageAmount();
                }
            }
        });
        return this.storageLevels[this.storageLevel].amount + shipPartsModifier;
    }
    
    // HEALTH
    getMaxHealth(): number {
        let shipPartsModifier = 0;
        this.shipPartContainer?.items?.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.healthAmount) {
                    shipPartsModifier += shipPart.shipPartData.healthAmount();
                }
            }
        });
        return this.maxHealthLevels[this.maxHealthLevel].amount + shipPartsModifier;
    }

    getMaxShield(): number {
        let shield = this.shieldLevels[this.shieldLevel].amount;
        this.shipPartContainer?.items?.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.shieldAmount) {
                    shield += shipPart.shipPartData.shieldAmount();
                }
            }
        });
        return shield;
    }

    getBaseEvadeChance(): number {
        let baseEvadeChance = 0;
        this.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.evadeChance) {
                    baseEvadeChance += shipPart.shipPartData.evadeChance();
                }
            }
        });
        return baseEvadeChance;
    };

    getEscapeChance(): number {
        let baseEscapeChance = 0.5;
        this.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.escapeChance) {
                    baseEscapeChance += shipPart.shipPartData.escapeChance();
                }
            }
        });
        return baseEscapeChance;
    };

    upgradeActionDisplay(): string {
        // Header
        let actionDisplay = "<span class='read'>" + 'Upgrade<span class="float-right">Cost</span>' + "</span><br>";

        const currentHealthLevel = this.maxHealthLevels[this.maxHealthLevel];

        // MAX HEALTH
        if (this.maxHealthLevel + 1 < this.maxHealthLevels.length) {
            const upgrade = this.maxHealthLevels[this.maxHealthLevel + 1];
            const amountDifference = upgrade.amount - currentHealthLevel.amount;

            actionDisplay += 'Health: ' + currentHealthLevel.amount + '(+' + amountDifference + ')'  + '<span class="float-right">' + upgrade.cost + '</span><br>';

        } else {
            actionDisplay += 'Health fully upgraded<br>';
        }

        // REACTOR
        const currentReactorLevel = this.reactorLevels[this.reactorLevel];
        if (this.reactorLevel + 1 < this.reactorLevels.length) {
            const upgrade = this.reactorLevels[this.reactorLevel + 1];
            const amountDifference = upgrade.amount - currentReactorLevel.amount;

            actionDisplay += 'Reactor: ' + currentReactorLevel.amount + '(+' + amountDifference + ')'  + '<span class="float-right">' + upgrade.cost + '</span><br>';

        } else {
            actionDisplay += 'Reactor fully upgraded<br>';
        }

        // ATTACK
        if (Clearance.getClearanceLevel() >= 3) {
            const currentAttackLevel = this.attackLevels[this.attackLevel];
            if (this.attackLevel + 1 < this.attackLevels.length) {
                const upgrade = this.attackLevels[this.attackLevel + 1];
                const amountDifference = upgrade.amount - currentAttackLevel.amount;

                actionDisplay += 'Attack: ' + currentAttackLevel.amount + '(+' + amountDifference + ')' + '<span class="float-right">' + upgrade.cost + '</span><br>';

            } else {
                actionDisplay += 'Attack fully upgraded<br>';
            }
        }

        // Shield
        if (Clearance.getClearanceLevel() >= 3) {
            const upgradeShieldLevel = this.shieldLevels[this.shieldLevel];
            if (this.shieldLevel + 1 < this.shieldLevels.length) {
                const upgrade = this.shieldLevels[this.shieldLevel + 1];
                const amountDifference = upgrade.amount - upgradeShieldLevel.amount;

                actionDisplay += 'Shield: ' + upgradeShieldLevel.amount + '(+' + amountDifference + ')' + '<span class="float-right">' + upgrade.cost + '</span><br>';

            } else {
                actionDisplay += 'Shield fully upgraded<br>';
            }
        }
        
        // STORAGE
        const currentStorageLevel = this.storageLevels[this.storageLevel];
        if (this.storageLevel + 1 < this.storageLevels.length) {
            const upgrade = this.storageLevels[this.storageLevel + 1];
            const amountDifference = upgrade.amount - currentStorageLevel.amount;

            actionDisplay += 'Storage: ' + currentStorageLevel.amount + '(+' + amountDifference + ')'  + '<span class="float-right">' + upgrade.cost + '</span><br>';

        } else {
            actionDisplay += 'Storage fully upgraded<br>';
        }

        actionDisplay += '<hr class="dark">[Upgrade]' + playerCredits.showCurrentCredits();

        return actionDisplay;
    }

    getHangarUpgradeActions(): { [key: string]: CommandConfig } {
        const actions: { [key: string]: CommandConfig } = {};

        const upgradeCommand: CommandConfig = {
            command: (command) => {
                return ['upgrade', 'upgrade health', 'upgrade max health', 'upgrade reactor', 'upgrade reactor capacity', 'upgrade storage', 'upgrade storage capacity', 'upgrade attack', 'upgrade attack capacity', 'upgrade shield capacity', 'upgrade shield'].includes(command);
            },
            displayName: () => {
                return this.upgradeActionDisplay();
            },
            section: 'Ship Upgrades',
            available: () => true,
            action: (command) => {
                const parts = command.split(' ');
                if (command == 'upgrade') {
                    Command.addCommandResponse('To upgrade your ship, choose the upgrade you want to purchase. For example, [Upgrade Max Health].');
                } else if (command == 'upgrade health' || command == 'upgrade max health') {
                    this.upgradeMaxHealth();
                } else if (command == 'upgrade reactor' || command == 'upgrade reactor capacity') {
                    this.upgradeReactor();
                } else if (command == 'upgrade storage' || command == 'upgrade storage capacity') {
                    this.upgradeStorage();
                } else if (command == 'upgrade attack' || command == 'upgrade attack capacity') {
                    this.upgradeAttack();
                } else if (command == 'upgrade shield' || command == 'upgrade shield capacity') {
                    this.upgradeShields();
                }
            }
        };

        actions.store = upgradeCommand;

        return actions;
    }

    upgradeMaxHealth(): void {
        if (this.maxHealthLevel + 1 < this.maxHealthLevels.length) {
            const upgrade = this.maxHealthLevels[this.maxHealthLevel + 1];
            if (playerCredits.getAmount() >= upgrade.cost) {
                playerCredits.spend(upgrade.cost);
                this.maxHealthLevel++;
                Command.addCommandResponse('Max health increased to ' + upgrade.amount);
                this.fullRepair();
            } else {
                Command.addCommandResponse('Not enough credits to upgrade max health.');
            }
        } else {
            Command.addCommandResponse('Max health is fully upgraded.');
        }
    }

    upgradeReactor(): void {
        if (this.reactorLevel + 1 < this.reactorLevels.length) {
            const upgrade = this.reactorLevels[this.reactorLevel + 1];
            if (playerCredits.getAmount() >= upgrade.cost) {
                playerCredits.spend(upgrade.cost);
                this.reactorLevel++;
                Command.addCommandResponse('Reactor capacity increased to ' + upgrade.amount);
                this.rechargeReactor();
            } else {
                Command.addCommandResponse('Not enough credits to upgrade reactor capacity.');
            }
        } else {
            Command.addCommandResponse('Reactor capacity is fully upgraded.');
        }
    }

    upgradeStorage(): void {
        if (this.storageLevel + 1 < this.storageLevels.length) {
            const upgrade = this.storageLevels[this.storageLevel + 1];
            if (playerCredits.getAmount() >= upgrade.cost) {
                playerCredits.spend(upgrade.cost);
                this.storageLevel++;
                Command.addCommandResponse('Storage capacity increased to ' + upgrade.amount);
                this.itemContainer.capacity = this.storageLevels[this.storageLevel].amount;
            } else {
                Command.addCommandResponse('Not enough credits to upgrade storage capacity.');
            }
        } else {
            Command.addCommandResponse('Storage capacity is fully upgraded.');
        }
    }

    upgradeShields(): void {
        if (this.shieldLevel + 1 < this.shieldLevels.length) {
            const upgrade = this.shieldLevels[this.shieldLevel + 1];
            if (playerCredits.getAmount() >= upgrade.cost) {
                playerCredits.spend(upgrade.cost);
                this.shieldLevel++;
                Command.addCommandResponse('Shield capacity increased to ' + upgrade.amount);

            } else {
                Command.addCommandResponse('Not enough credits to upgrade shield capacity.');
            }
        } else {
            Command.addCommandResponse('Shield is fully upgraded.');
        }
    }

    upgradeAttack(): void {
        if (this.attackLevel + 1 < this.attackLevels.length) {
            const upgrade = this.attackLevels[this.attackLevel + 1];
            if (playerCredits.getAmount() >= upgrade.cost) {
                playerCredits.spend(upgrade.cost);
                this.attackLevel++;
                Command.addCommandResponse('Base attack increased to ' + upgrade.amount);

            } else {
                Command.addCommandResponse('Not enough credits to upgrade base attack.');
            }
        } else {
            Command.addCommandResponse('Base attack is fully upgraded.');
        }
    }

    death() : void {
        this.deathEffects();
        // transition to station
        if (SM.checkCurrentState('world')) {
            this.deathTransitionToStation();
        }
        // If we're in combat, the combat will handle the death effects.
        
    }

    deathEffects() : void {
        Command.addCommandResponse('Your ship has been destroyed');
        playerCredits.onDeath();
        playerShip.itemContainer.removeAllItems();
        world.map.onDeath();
    }

    deathTransitionToStation() : void {
        console.log('you died and we\'re transitions back to station');
        Station.enterStation('reiner-station');
        Command.addCommandResponse('<hr>You come to with a note taped to your ship\'s windshield:<br><br>What happened out there?? Don\'t make me come get you again. I had to use some of your credits to fix up your ship. Be more careful next time.<br>-B. Bendo<hr>'); 
        world.exitWorld();
        playerShip.onDock();

    }

    fullRepair(): void {

        if (this.currentHealth < this.getMaxHealth()) {
            Command.addCommandResponse('Ship fully repaired.');
        }

        this.currentHealth = this.getMaxHealth();
        
    }

    // REACTOR
    getMaxReactor(): number {
        let shipPartsModifier = 0;
        this.shipPartContainer?.items?.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.reactorAmount) {
                    shipPartsModifier += shipPart.shipPartData.reactorAmount();
                }
            }
        });
        return this.reactorLevels[this.reactorLevel].amount + shipPartsModifier;
    }

    modifyReactor(amount: number): void {
        this.currentReactor += amount;
        if (this.currentReactor > this.getMaxReactor()) {
            this.currentReactor = this.getMaxReactor();
        } else if (this.currentReactor < 0) {
            Command.addCommandResponse('Warning: Reactor overheated!');
            this.modifyHealth(-1);
            this.currentReactor = 0;
        }
    }

    rechargeReactor(): void {
        this.currentReactor = this.getMaxReactor();
    }

    rechargeShields(): void {
        this.currentShield = this.getMaxShield();
    }

    // SHIP EVENTS
    onDock(): void { 
        this.rechargeReactor();
        this.rechargeShields();
        this.fullRepair();
    }
    onTakeoff(): void {
        this.rechargeReactor();
        this.rechargeShields();
    }
    onShipMove(): void {
        this.modifyReactor(-1);

        this.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onMoveAction) {
                    shipPart.shipPartData.onMoveAction(this);
                }
            }
        });
    }

    onTakeDamage() : void {
        rivePlayerDamaged.fire();
        playerDamageTaken();
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onTakeDamageAction) {
                    shipPart.shipPartData.onTakeDamageAction();
                }
            }
        });
    }

    onShieldLoss() : void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            if (item instanceof ShipPart) {
                const shipPart = item as ShipPart;
                if (shipPart.shipPartData.onShieldLossAction) {
                    shipPart.shipPartData.onShieldLossAction();
                }
            }
        });
    }

    onTurnBegin() : void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            const shipPart = item as ShipPart;
            shipPart.shipPartData.onTurnBegin?.();
        });
    }

    onTurnEnd() : void {
        super.onTurnEnd();
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            const shipPart = item as ShipPart;
            shipPart.shipPartData.onTurnEnd?.();
        });
    }
    
    onCombatBegin() : void {
        super.onCombatBegin();
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            const shipPart = item as ShipPart;
            shipPart.shipPartData.onCombatBegin?.();
        });
    }

    onCombatEnd() : void {
        playerShip.shipPartContainer.items.forEach((quantity, item) => {
            const shipPart = item as ShipPart;
            shipPart.shipPartData.onCombatEnd?.();
        });
    }
}

export function generateBar(maxValue: number, currentValue: number): string {
    const barLength = 8; // Fixed length of the bar

    // Ensure currentValue does not exceed maxValue
    if (currentValue > maxValue) {
        currentValue = maxValue;
    }
    
    // Ensure currentValue is not below zero
    if (currentValue < 0) {
        currentValue = 0;
    }

    // Calculate the number of filled slots in the bar based on the fixed length
    const filledLength = Math.round((currentValue / maxValue) * barLength);
    
    // Create the filled part of the bar
    const filledBar = '█'.repeat(filledLength);
    
    // Create the empty part of the bar
    const emptyBar = '░'.repeat(barLength - filledLength);
    
    // Combine the filled and empty parts
    const healthBar = `◇${filledBar}${emptyBar}◇`;

    return healthBar;
}

const healthUpgrades: IUpgradeLevel[] = [
    { cost: 0, amount: 5, clearanceLevel: 1},
    { cost: 5, amount: 8, clearanceLevel: 1},
    { cost: 10, amount: 10, clearanceLevel: 1},
    { cost: 20, amount: 15, clearanceLevel: 3}
];

const storageUpgrades: IUpgradeLevel[] = [
    { cost: 0, amount: 5, clearanceLevel: 1},
    { cost: 5, amount: 10, clearanceLevel: 1},
    { cost: 10, amount: 20, clearanceLevel: 1},
    { cost: 40, amount: 50, clearanceLevel: 3},
    { cost: 100, amount: 100, clearanceLevel: 3}
];

const reactorUpgrades: IUpgradeLevel[] = [
    { cost: 0, amount: 5, clearanceLevel: 1},
    { cost: 5, amount: 8, clearanceLevel: 1},
    { cost: 10, amount: 10, clearanceLevel: 1},
    { cost: 20, amount: 15, clearanceLevel: 3}
];

const attackUpgrades: IUpgradeLevel[] = [
    { cost: 0, amount: 1, clearanceLevel: 3},
    { cost: 5, amount: 2, clearanceLevel: 3},
    { cost: 10, amount: 4, clearanceLevel: 3},
    { cost: 20, amount: 6, clearanceLevel: 3},
    { cost: 50, amount: 8, clearanceLevel: 3},
    { cost: 100, amount: 12, clearanceLevel: 3},
];

const shieldUpgrades: IUpgradeLevel[] = [
    { cost: 0, amount: 0, clearanceLevel: 3},
    { cost: 5, amount: 2, clearanceLevel: 3},
    { cost: 10, amount: 3, clearanceLevel: 3},
    { cost: 20, amount: 4, clearanceLevel: 3},
    { cost: 50, amount: 5, clearanceLevel: 3},
    { cost: 100, amount: 6, clearanceLevel: 3},
];

export const playerShip = new PlayerShip(1, 4, healthUpgrades, reactorUpgrades, storageUpgrades, attackUpgrades, shieldUpgrades);