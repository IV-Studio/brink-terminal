import getSMInstance from '../statemanager.js';
const SM = getSMInstance();

const ConnectionError = {
    Actions: {
        additionalActions: [],
        errorMessage: function () {
            return 'Connection error. Check your internet connection and refresh the page.';
        }, 
        state: 'connectionError',
        actionTitle: () => 'Error',
        displayTitle: () => 'Error',
        onEntry: function () {},
        onExit: function () {},
        entryCommandMessage: function () {
            return 'Connection error. Check your internet connection and refresh the page.';
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
            
        }
    },
}

export default ConnectionError;