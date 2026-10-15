import getSMInstance from '../statemanager.js';
import Command from '../command.js';
import Station from './station.js';
import {brinkLogoReveal} from "../rive.js";
import { urlPath } from '../context.js';

const SM = getSMInstance();

const Username = {
    Actions: {
        additionalActions: [],
        errorMessage: "Error: Did not recognize command.",
        state: 'username',
        actionTitle: () => 'Username',
        displayTitle: () => 'Welcome',
        onEntry: function () {
            if (brinkLogoReveal != null) {
                brinkLogoReveal.value = true
            }
        },
        onExit: function () {
        },
        entryCommandMessage: function () { 
            if (urlPath == '') {
                return '<hr>Welcome to the Station Terminal.<br><br>Enter a username:';
            } else {
                return '<hr>Congratulations, you have found a Brink Terminal key card! Enter a username to reveal your key card codeword:'
            }
        },
            
        entryDisplayMessage: () => usernameBootSequence,
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return this.actionList;
        }, 
        actionList: {
            
        }
    },


    init: function () {

    },

    setUsername: function (username) {
        SM.set('game.username', username);
    },

    getUsername: function () {
        return SM.get('game.username');
    }
    
}

const usernameBootSequence = "<h5>Initializing Brink Terminal System... <br> "+ 
"BRINK Terminal<br><br> "+ 
"BIOS Checksum: 7B2A-43FE <br> "+ 
"Base Memory: 640K OK <br> "+ 
"Extended Memory: 256MB OK <br><br> "+ 
"Checking Boot Configuration... <br> "+ 
"ROM Version: 2.45 <br> "+ 
"Processor Type: Quantum-78 Series <br> "+ 
"Processor Speed: 4.2 THz <br><br> "+ 
"Loading Device Drivers... <br> "+ 
"  - Network Interface: OK <br> "+ 
"  - Sensor Suite: OK <br> "+ 
"  - Gravity Calibration: OK <br> "+ 
"  - Environmental Control: OK <br><br> "+ 
"Loading Resource Index... <br> "+ 
"Resource Checksum: 54F9-2DA1-1B77 <br> "+ 
"Resource Load Time: 312ms <br> "+ 
"System Diagnostic: PASS <br><br> "+ 
"Enabling Advanced Systems... <br> "+ 
"AI Module Status: Initialized <br> "+ 
"Data Stream Link: Enabled <br> "+ 
"Secure Communications: Enabled <br> "+ 
"Brink Terminal Boot Complete <br><br><br> "+ 
"Welcome to Brink Terminal, Captain. <br></h5>";

export default Username;

