import getSMInstance from '../statemanager.js';
import Command from '../command.js';
import Actions from '../actions.js';
const SM = getSMInstance();

const Keywords = {
    init: function () {
        SM.set('game.keywords', []);
    },
    keywordEntry: function(input) {
        if (this.checkForKeyword(input) == false) {
            for (const key in Keywords.keywordList) {
                const keywords = Keywords.keywordList[key].keyword;
        
                // Check if the input matches any of the keywords
                if (keywords.includes(input)) {
                    
                    Keywords.keywordList[key].onSuccess();
                    Keywords.logKeyword(input);
                    Actions.refreshCurrentActions();
                    return true;
                }
            }
            return false;
        } else {
            Command.addCommandResponse('You\'ve already entered this passcode.'); 
            return true;
        }
    },
    checkForKeyword: function (input) {
        const unlockedKeywords = SM.get('game.keywords');

        if (unlockedKeywords.includes(input)) {
            return true;
        } else {
            return false;
        }
    }, 
    logKeyword: function(keyword) {
        let keywords = SM.get('game.keywords');
        if (keywords.includes(keyword)) {

        } else {
            keywords.push(keyword);
        }
        SM.set('game.keywords', keywords);
        SM.logState();
    },
    updateKeywords: function(keywords) {
        SM.set('game.keywords', keywords);
    },
    getKeywords: function() {
        return SM.get('game.keywords');
    },
    newMessageUnlocked: function() {
        Command.addCommandResponse('You have 1 new message.'); 
    },
    newFileUnloacked: function() {
        Command.addCommandResponse('A file has been added to your database.'); 
    },
    keywordList : {
        // FACTIONS
        'sorelia' : {
            keyword: ['sorelia', 'Sorelia'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        'komek' : {
            keyword: ['komek', 'Komek'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        'magnomi' : {
            keyword: ['magnomi', 'Magnomi'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        'henko' : {
            keyword: ['Henko', 'henko'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        'ventus' : {
            keyword: ['ventus', 'Ventus'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        'ua' : {
            keyword: ['ua', 'UA', 'utopian alliance', 'Utopian Alliance'],
            onSuccess: function () { Keywords.newFileUnloacked() },
        },
        // CLEARANCE -1
        'deleted' : {
            keyword: ['deleted', 'Deleted', 'show deleted', 'show deleted messages'],
            onSuccess: function () { Keywords.newMessageUnlocked() },
        },
    },
    handleServerResponse: function (response) {
        Keywords.updateKeywords(response);
    },
}

export default Keywords;