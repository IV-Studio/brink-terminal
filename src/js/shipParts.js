import Ships from "./ships.js";
import Command from "./command.js";
import getSMInstance from './statemanager.js';

const SM = getSMInstance();

const ShipParts = {
    init: function () {

    },
    Parts: {
        'Thruster_3000': {
            id: 'Thruster_3000',
            name: 'Thruster 3000',
            type: 'thruster',
            clearance: 0,
            cost: 2,
            sellPrice: 1,
            equip: function() {
                let shipPart = [];
                shipPart['thrusterAmount'] = 10;
                shipPart['thrusterMax'] = 10;
                SM.set('ship.shipParts.' + this.id, shipPart);
            },
            remove: function() {
                SM.remove('ship.shipParts.' + this.id, shipPart);
            },
            refresh: function() {
                SM.set('ship.shipParts.' + this.id + '.thrusterAmount', 10);
            },
            onMove: function () {
                let thrusterValue = SM.add('ship.shipParts.' + this.id + '.thrusterAmount', -1);
                if (thrusterValue == 5) {
                    Command.addCommandResponse('Your thrusters is half empty. Consider heading back.');
                } else if (thrusterValue <= 0) {
                    SM.set('ship.shipParts.' + this.id + '.thrusterAmount', 0);
                    Ships.addPlayerHP(-1);
                    Command.addCommandResponse('Your thrusters are overheating!');
                }
            },
            actionDisplay: function() {
                if (SM.checkCurrentState('world')) {
                    return this.name + ': ' + SM.get('ship.shipParts.' + this.id + '.thrusterAmount') + ' / ' + SM.get('ship.shipParts.' + this.id + '.thrusterMax');
                } else {
                    return '';
                }
            },
            battleAction: function () {
                return 'This has no effect here';
            },
        },
    },
    
    equipShipPart: function (shipPart) {
        if (ShipParts.Parts[shipPart] != null) {
            ShipParts.Parts[shipPart].equip();
        } else {
            console.warn("ERROR, could not find ship part");
        }
    },
    
    getPlayerShipParts: function () {
        const shipPartTitles = [];
        
        const smShipParts = SM.get('ship.shipParts');
        
        for (const [key, value] of Object.entries(smShipParts)) {
            shipPartTitles.push(key);
        }
        
        const shipParts = [];

        for (const [key, value] of Object.entries(ShipParts.Parts)) {
            if (shipPartTitles.includes(key)){
                shipParts.push(value);
            }
        }
        
        return shipParts;
    },
    
    onMove: function () {
        
        const playerShipParts = ShipParts.getPlayerShipParts();
        
        for (let i = 0; i < playerShipParts.length; i++) {
            
            if(typeof playerShipParts[i].onMove === 'function') {
                playerShipParts[i].onMove();
            }
        }
    },
    
    onDock: function() {
        const playerShipParts = ShipParts.getPlayerShipParts();

        // Refresh all ship parts
        for (let i = 0; i < playerShipParts.length; i++) {

            if(typeof playerShipParts[i].refresh === 'function') {
                playerShipParts[i].refresh();
            }
        }
    }
}

export default ShipParts;