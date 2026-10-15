import Items from "./items.js";
import Command from "./command.js";
import getSMInstance from './statemanager.js';
import { playerDamageTaken } from "./riveMap";

const SM = getSMInstance();

const Ships = {
    
    STARTING_SHIP: 'playerShip',

    StatusDisplay: {
        title: "--SHIP--",
        additionalActions: [],
        errorMessage: '',
        actionList: {
            'health': {
                command: [],
                section: 'ship',
                displayName: function (){ return Ships.healthDisplay()},
                available: function () { return true;},
                action: function () {},
            },
            'shipParts': {
                command: [],
                section: 'ship',
                displayName: function () { 

                    let returnString = '';
                    const shipParts = ShipParts.getPlayerShipParts();
                    for (let i = 0; i < shipParts.length; i++) {
                        returnString += shipParts[i].actionDisplay() + '</br>';
                    }

                    return returnString;
                },
                available: function () { return true;},
                action: function () {},
            },
        }
    },
    
    ShipData: {
        'playerShip': {
            id: 'playerShip',
            name: 'Pyro GX',
            type: 'fighter',
            hp: 5,
            weapons: 2,
            reactors: 1,
            thrusters: 1,
            shields: 1,
            lidar: 1,
            storage: 5,
            cost: 10,
            sellPrice: 8,
        }
    },

    
    init: function () {
        Ships.setupPlayerShip();
    },
    
    setupPlayerShip: function () {
        Ships.createPlayerShip(Ships.STARTING_SHIP);
    },
    
    createPlayerShip: function(shipId) {
        
        const shipData = Ships.getShipData(shipId);
        
        if (shipData != null) {
            SM.set('ship.id', shipId);
            SM.set('ship.maxHp', shipData['hp'])
            SM.set('ship.hp', shipData['hp'])
            SM.set('ship.inventory', Items.createItemContainer('Inventory', shipData['storage'], false));
        } else {
            console.warn("ERROR: could not create player ship");
        }
        
    },
    
    getShipData: function(id){
        for (const [key, value] of Object.entries(Ships.ShipData)) {
            if(value.id == id){
                return Ships.ShipData[key];
            }
        }
        console.warn("ERROR: there is no ship with this id");
        return null;
    },
    
    getPlayerHP: function() {
        return {
            hp: SM.get('ship.hp'),
            maxHp: SM.get('ship.maxHp'),
        }
    },
    
    addPlayerHP: function(amount){
        let hp = SM.get('ship.hp');
        let maxHP = SM.get('ship.maxHp');
        
        if (amount > 0) {
            Command.addCommandResponse('Gained ' + amount + ' HP!');
        } else if (amount < 0) {
            playerDamageTaken();
            Command.addCommandResponse('Lost ' + amount + ' HP!');
        }
        
        hp += amount;
        
        if (hp < 0) {
            hp = 0;
            // TO DO: Handle death and game over
            console.log("you ded");
        } else if (hp > maxHP) {
            hp = maxHP;
        }
        
        SM.set('ship.hp', hp);
    },

    healthDisplay: function () {
        return 'HP: ' + Ships.getPlayerHP().hp + " / " + Ships.getPlayerHP().maxHp;
    }
    
}

export default Ships;
