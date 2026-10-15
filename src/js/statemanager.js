//const State = {};
let instance = null;

const SM = {

    state: {},
    test: 1,

    init: function () {

    },

    setup: function() {
        //create categories
        var cats = [
            'maps',		
            'ship', 	
            'game', 		
            'playStats'
        ];

        for(var which in cats) {
            if(!SM.get(cats[which])) SM.set(cats[which], {});
        };

        SM.logState();

    },

    logState: function() {
        console.log(SM.state);
    },

    set: function(property, value) {
        //console.log('setting = ' + property + ' to ' + value);
        // Split the property string into an array of keys
        const keys = property.split('.');
        
        // Initialize a reference to traverse the State dictionary
        let currentState = SM.state;
    
        // Traverse the State dictionary using the keys
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            // If the key doesn't exist, create an empty object
            if (!(key in currentState)) {
                currentState[key] = {};
            }
            // Update the reference to the next level of the dictionary
            currentState = currentState[key];
        }
    
        // Set the value at the final key
        const lastKey = keys[keys.length - 1];
        currentState[lastKey] = value;
    },
    get: function(property) {
        // Split the property string into an array of keys
        const keys = property.split('.');

        // Initialize a reference to traverse the State dictionary
        let currentState = SM.state;

        // Traverse the State dictionary using the keys
        for (let key of keys) {
            // If the current key doesn't exist, return undefined
            if (!(key in currentState)) {
                return undefined;
            }
            // Update the reference to the next level of the dictionary
            currentState = currentState[key];
        }

        // Return the value at the final key
        return currentState;
    },
    remove: function(property) {
        // Split the property string into an array of keys
        const keys = property.split('.');
        
        // Initialize a reference to traverse the State dictionary
        let currentState = SM.state;
    
        // Traverse the State dictionary using the keys
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            // If the current key doesn't exist, return
            if (!(key in currentState)) {
                return;
            }
            // Update the reference to the next level of the dictionary
            currentState = currentState[key];
        }
    
        // Remove the property from the dictionary
        delete currentState[keys[keys.length - 1]];
    },
    add: function(property, amount) {
        console.log('adding ' + amount + ' to ' + property);
        // Get the current value of the property
        const currentValue = SM.get(property);
    
        // Check if the current value is a number
        if (typeof currentValue !== 'number') {
            console.warn('Error adding to ' + property);
            return null; // Return null if the state wasn't a number
        }
    
        // Add the amount to the current value
        SM.set(property, currentValue + amount);
    },
    checkCurrentState: function (state) {
        if (SM.get('game.currentState') == state) {
            return true;
        } else {
            return false;
        }
    },
    setCurrentState: function (state) {
        SM.set('game.currentState', state)
    },
    getCurrentState: function () {
        return SM.get('game.currentState');
    },
    setPreviousState: function (state) {
        SM.set('game.previousState', state)
    },
    getPreviousState: function () {
        return SM.get('game.previousState');
    },
    setConversation: function (state) {
        SM.set('game.currentConversation', state)
    },
    getConversation: function () {
        return SM.get('game.currentConversation')
    },
    getUsername: function() {
        return SM.get('game.username');
    }
};

export default function getSMInstance() {
    if (!instance) {
        instance = Object.assign({}, SM); // Create a shallow copy to prevent modification of the original SM object
        instance.init(); // Initialize the singleton instance
    }
    return instance;
}