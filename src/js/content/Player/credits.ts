import Command from "../../command.js";
import getSMInstance from "../../statemanager.js";

const SM = getSMInstance();

class Credits {
    private amount: number;
  
    constructor(initialAmount: number = 0) {
      this.amount = initialAmount;
      this.saveCreditAmount();
    }
    
  
    // Method to gain credits
    gain(credits: number): void {
      if (credits <= 0) {
        console.error("Gain amount must be positive.");
        return;
      }
      this.amount += credits;
      console.log(`Gained ${credits} credits. Total credits: ${this.amount}`);
      Command.addCommandResponse(`Gained ${credits} credits. Total credits: ${this.amount}`);
      this.saveCreditAmount();
    }
  
    // Method to spend credits
    spend(credits: number): void {
      if (credits <= 0) {
        console.error("Spend amount must be positive.");
        return;
      }
      if (credits > this.amount) {
        
        this.messageInsufficientCredits();
        return;
      }
      this.amount -= credits;
      Command.addCommandResponse(`Spent ${credits} credits. Remaining credits: ${this.amount}`);
      this.saveCreditAmount();
    }
  
    // Method to get current amount of credits
    getAmount(): number {
      return this.amount;
    }

    messageInsufficientCredits(): void {
        Command.addCommandResponse(`Insufficient credits.`);
    }

    private saveCreditAmount() {
        SM.set('game.credits', this.amount);
    }

    showCurrentCredits(): string {
        let contentsString = '';

        contentsString += '<span class="float-right">Credits: ' + this.getAmount() + '</span>';

        return contentsString;
    }

    onDeath(): void {
      this.amount = 0;
      this.saveCreditAmount();
    }
  }
  
  // Example usage:
  export let playerCredits: Credits;
export function initializeCredits() {
    return playerCredits ??= new Credits(2);
}