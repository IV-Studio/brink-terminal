export class AttackAction {
    damageAmount: number;
    damageMultiplier: number;
    hitPercentageChance: number;
    shieldPiercing: boolean;
    reactorCost: number;

    constructor({
        damageAmount = 0,
        damageMultiplier = 0,
        hitPercentageChance = 1,
        shieldPiercing = false,
        reactorCost = 0
    }: {
        damageAmount?: number,
        damageMultiplier?: number,
        hitPercentageChance?: number,
        shieldPiercing?: boolean,
        reactorCost?: number
    } = {}) {
        this.damageAmount = damageAmount;
        this.damageMultiplier = damageMultiplier;
        this.hitPercentageChance = hitPercentageChance;
        this.shieldPiercing = shieldPiercing;
        this.reactorCost = reactorCost;
    }
    // Method to calculate the effective damage
    calculateEffectiveDamage(): number {
        if (this.damageMultiplier == 0) {
            return this.damageAmount;
        } else {
            return this.damageAmount * this.damageMultiplier;
        }
    }

    // Method to determine if the attack hits
    doesHit(): boolean {
        return Math.random() < this.hitPercentageChance;
    }

}