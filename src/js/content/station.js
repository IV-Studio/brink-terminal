import Actions from "../actions.js";
import Command from "../command.js";
import Messages from './messages.js';
import getSMInstance from '../statemanager.js';
import Clearance from "./clearance.js";
import { brinkLogoReveal } from "../rive.js";
import Rooms from "./rooms.js";
import Username from "./username.js";
import Database from "./database.js";
import { world } from "./Map/world";
import { supplyDepot } from "./Stores/supplyDepot";
import { urlPath } from "../context.js";
import { versionNumber } from "../config.js";
import { armory } from "./Stores/armory";
import { playerCredits } from "./Player/credits";

const SM = getSMInstance();

const Station = {
    // ACTIONS
    Actions: {
        additionalActions: [],
        errorMessage: "Error: Did not recognize command.",
        state: 'station',
        actionTitle: () => 'Station Terminal',
        displayTitle: () => 'Welcome',
        onEntry: function () {
            if (brinkLogoReveal != null) {
                brinkLogoReveal.value = true
            }
            armory.setupArmory();
        },
        onExit: function () {
            if (brinkLogoReveal != null) {
                brinkLogoReveal.value = false
            }
        },
        entryCommandMessage: function () {
            let clearanceLevel = Clearance.getClearanceLevel();
            if (clearanceLevel == -1) {
                clearanceLevel = 0;
            }

            let returnString = '<hr>Loading ' + Station.getStationName() + ' Terminal OS ' + versionNumber + '<br>Your current Clearance Level is ' + clearanceLevel + '.';
            if (urlPath != '') {
                returnString += '<hr>Your key card codeword is: ' + urlPath +'<br>Please manually enter the codeword to confirm.';
            }
            return returnString;
        },
        entryDisplayMessage: () => stationBootSequence(),
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return this.actionList;
        }, 
        getActionList: function () {
            var combinedList = {...this.actionList, ...Rooms.getRoomActions()};
            return combinedList;
        }, 
        actionList: {
            'armory': {
                command: function (command) {
                    return ['armory', 'a'].includes(command);
                },
                displayName: '[A]rmory',
                section: 'flight deck',
                available: function () {
                    return (Clearance.getClearanceLevel() <= 2);
                },
                action: function () {
                    Command.addCommandResponse('Access Denied: Level 3 Clearance required');
                },
            },
            'dispatch': {
                command: function (command) {
                    return ['dispatch', 'd'].includes(command);
                },
                displayName: '[D]ispatch',
                section: 'flight deck',
                hidden: true,
                available: function () {
                    return false;
                },
                action: function () {
                    Command.addCommandResponse('Access Denied: Level 1 Clearance required');
                },
            },
            'clearance': {
                command: function (command) {
                    return ['clearance', 'c', 'clearance code'].includes(command);
                },
                displayName: function () {
                    let clearanceLevel = Clearance.getClearanceLevel();

                    if (clearanceLevel == -1) {
                        clearanceLevel = 0;
                    }
                    return '[C]learance Level:' + '<span class="float-right">' + clearanceLevel + '</span>';
                },
                section: 'my terminal',
                available: function () {
                    return SM.checkCurrentState('station');
                },
                action: function () {
                    Actions.changeActionState(Clearance.Actions.state);
                },
            },
            'messages': {
                command: function (command) {
                    return ['messages', 'm', 'Messages', 'M'].includes(command);
                },
                displayName: function () {
                    return '[M]essages: ' + '<span class="float-right">' + Messages.getTotalMessageCount() + '</span>';
                },
                section: 'my terminal',
                available: function () {
                    return SM.checkCurrentState('station');
                },
                action: function () {
                    Actions.changeActionState(Messages.Actions.state);
                },
            },
            'database': {
                command: function (command) {
                    return ['database', 'd', 'Database', 'D'].includes(command);
                },
                displayName: function () {
                    return '[D]atabase';
                },
                section: 'my terminal',
                available: function () {
                    return SM.checkCurrentState('station');
                },
                action: function () {
                    Actions.changeActionState(Database.Actions.state);
                },
            },
            'hangar': {
                command: function (command) {
                    return ['hangar', 'h'].includes(command);
                },
                displayName: function () {
                    return '[H]angar';
                },
                section: 'flight deck',
                available: function () {
                    return (Clearance.getClearanceLevel() <= 1);
                },
                action: function () {
                    Command.addCommandResponse('Access Denied: Level 2 Clearance required');
                },
            },
            'supply-depot': {
                command: function (command) {
                    return ['supply', 's', 'supply depot'].includes(command);
                },
                displayName: '[S]upply Depot',
                section: 'flight deck',
                hidden: function () {
                    return !(Clearance.getClearanceLevel() >= 2);
                },
                available: function () {
                    return (Clearance.getClearanceLevel() >= 2);
                },
                action: function () {
                    Actions.changeActionState(supplyDepot.actions.state);
                },
            },
            'ivadmin-100': {
                command: function (command) {
                    return ['ivadmin-100'].includes(command);
                },
                displayName: '',
                section: 'flight deck',
                hidden: function () {
                    return true;
                },
                available: function () {
                    return (Clearance.getClearanceLevel() >= 4);
                },
                action: function () {
                    playerCredits.gain(100);
                },
            }
            
        }
    },

    Stations: {
        'reiner-station': {
            key: 'reiner-station',
            level: 0,
            name: 'Reiner Station',
        },
        'leppik-station': {
            key: 'leppik-station',
            level: 0,
            name: 'Leppik Station',
        },
        'queens-port': {
            key: 'queens-port',
            level: 0,
            name: 'Queens Port',
        },
        'kaos-station': {
            key: 'kaos-station',
            level: 0,
            name: 'Queens Port',
        }
    },

    init: function () {
        SM.set('game.recentStation', 'reiner-station');
    },

    enterStation: function (stationName) {
        SM.set('game.recentStation', stationName);
        Actions.changeActionState(Station.Actions.state)
        Actions.showActions();
    },

    getStationName: function () {
        const currentStation = SM.get('game.recentStation');
        return Station.Stations[currentStation].name;
    },
    getStationId: function () {
        const currentStation = SM.get('game.recentStation');
        return Station.Stations[currentStation].key;
    }

}

function stationBootSequence() {
    return "<h5>Initializing Brink Terminal System... <br> " +
        "BRINK Terminal " + versionNumber + " <br><br> " +
        "BIOS Checksum: 7B2A-43FE <br> " +
        "Base Memory: 640K OK <br> " +
        "Extended Memory: 256MB OK <br><br> " +
        "Checking Boot Configuration... <br> " +
        "ROM Version: 2.45 <br> " +
        "Processor Type: Quantum-78 Series <br> " +
        "Processor Speed: 4.2 THz <br><br> " +
        "Loading Device Drivers... <br> " +
        "  - Network Interface: OK <br> " +
        "  - Sensor Suite: OK <br> " +
        "  - Gravity Calibration: OK <br> " +
        "  - Environmental Control: OK <br><br> " +
        "Loading Resource Index... <br> " +
        "Resource Checksum: 54F9-2DA1-1B77 <br> " +
        "Resource Load Time: 312ms <br> " +
        "System Diagnostic: PASS <br><br> " +
        "Enabling Advanced Systems... <br> " +
        "AI Module Status: Initialized <br> " +
        "Data Stream Link: Enabled <br> " +
        "Secure Communications: Enabled <br> " +
        "Brink Terminal Boot Complete <br><br><br> " +
        "Welcome to Brink Terminal, " + Username.getUsername() + ". <br></h5>";
}

export default Station;