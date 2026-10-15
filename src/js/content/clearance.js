import Actions from '../actions.js';
import Station from './station.js';
import getSMInstance from '../statemanager.js';
import Command from '../command.js';
import {convertDateTime} from '../formatting.js';
const SM = getSMInstance();

const Clearance = {
    setClearanceLevel: function (level) {
        SM.set('game.clearance', level);
    },
    getClearanceLevel: function () {
        return SM.get('game.clearance');
    },
    Actions: {
        additionalActions: [],
        errorMessage: function () {
            if (Clearance.getClearanceLevel() == -1) {
                return '<hr>Maintanence will be complete at ' + convertDateTime(Clearance.clearanceLevelTimes[0]);
            } else {
                return 'Error: Clearance Code not recognized.<br>Enter clearance code:';
            }
        }, 
        state: 'clearance',
        actionTitle: () => 'Clearance Code',
        displayTitle: () => 'Enter Code',
        onEntry: function () {},
        onExit: function () {},
        entryCommandMessage: function () {
            if (Clearance.getClearanceLevel() == -1) {
                return '<hr>The M.I.U. Clearance Database is undergoing maintenance.<br>...<br>...<br><br>Maintenance is expected to be complete by the following date and time:<br>' + convertDateTime(Clearance.clearanceLevelTimes[0]);
            }
            return '<hr>Loading M.I.U. Clearance Database. Your current clearance level is ' + Clearance.getClearanceLevel() + '.<br>Enter clearance code:';
        },
        entryDisplayMessage: function () {
            return '';
        },
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return this.actionList;
        }, 
        actionList: {
            'return': {
                command: function (command) {
                    return ['quit', 'q'].includes(command);
                },
                displayName: '[Q]uit',
                section: 'commands',
                available: function () {
                    return true;
                },
                action: function () {
                    Actions.changeActionState(Station.Actions.state);
                },
            }
        }
    },
    handleServerResponse: function (response) {
        Clearance.setClearanceLevel(response);
    },
    clearanceLevelTimes:{
        0: new Date(Date.UTC(2024, 4, 7, 19, 0, 0)),
    }
}

export default Clearance;