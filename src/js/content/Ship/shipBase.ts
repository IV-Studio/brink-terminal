import type { AttackAction } from '../Combat/combatActions';

interface ShipPresentation {
    command: { addCommandResponse(message: string): void };
    animations: typeof import('../../riveMap');
    getClearance(): number;
    getPlayerAttack(): number;
}
let presentation: ShipPresentation;
export function configureShipPresentation(value: ShipPresentation) { presentation = value; }

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
            presentation.command.addCommandResponse('Evaded attack!');
        } else {
            if (attackAction.doesHit()) {
                const leftoverDamage = this.modifyShields(-attackAction.calculateEffectiveDamage());
                this.modifyHealth(-leftoverDamage);
            } else {
                presentation.command.addCommandResponse('Attack missed!');
            }
        }
    }

    // Method to modify the ship's health.
    modifyHealth(amount: number): void {

        if (amount < 0) {
            this.onTakeDamage();
            presentation.command.addCommandResponse(this.name + ' took ' + amount + ' damage.');
        } else if (amount > 0) {
            presentation.command.addCommandResponse(this.name + ' has been repaired. Gained +' + amount + ' health.');
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
            presentation.animations.rivePlayerHealthValue.value = 100 * this.currentHealth / this.getMaxHealth();
        } else {
            presentation.animations.riveEnemyHealthValue.value = 100 * this.currentHealth / this.getMaxHealth();
        }
    }

    modifyShields(amount: number): number {

        let leftoverDamage = 0;

        if (amount < 0) {
            if (this.isPlayer) {
                presentation.animations.playerDamageTaken();
                this.onShieldLoss();
            }
            if (this.currentShield > 0 && -amount < this.currentShield) {
                presentation.command.addCommandResponse(this.name + ' lost ' + amount + ' shields.');
            } else if (this.currentShield > 0) {
                presentation.command.addCommandResponse(this.name + ' lost ' + this.currentShield + ' shields.')
            }
        } else {
            presentation.command.addCommandResponse(this.name + '\'s shields has been recharged. Gained +' + amount + ' shield.');
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
                presentation.animations.rivePlayerShieldOn.value = true;
            } else {
                presentation.animations.riveEnemyShieldOn.value = true;
            }
        } else {
            if (this.isPlayer) {
                presentation.animations.rivePlayerShieldOn.value = false;
            } else {
                presentation.animations.riveEnemyShieldOn.value = false;
            }
        }

        if (this.isPlayer) {
            presentation.animations.rivePlayerSheildValue.value = 100 * this.currentShield / this.getMaxShield();
        } else {
            presentation.animations.riveEnemySheildValue.value = 100 * this.currentShield / this.getMaxShield();
        }
    }

    

    showShipData() : string {

        const attack = 'Attack:<span class="float-right">' + presentation.getPlayerAttack() + '</span>';
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

        if (presentation.getClearance() >= 3 && this.isPlayer) {
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

