import Command from "./command.js";
import Station from "./content/station.js";
import Messages from "./content/messages.js";
import Rooms from "./content/rooms.js";
import getSMInstance from './statemanager.js';
import { errorTrigger } from "./rive.js";
import Clearance from "./content/clearance.js";
import Display from "./display.js";
import Username from "./content/username.js";
import Database from "./content/database.js";
import Keywords from "./content/keywords.js";
import Conversation from "./content/conversation.js";
import { api, apiErrorMessage } from './api.js';
import { formatStoryHtml } from './html.js';
import ConnectionError from "./content/connectionError.js";
import { world } from "./content/Map/world";
import { supplyDepot } from "./content/Stores/supplyDepot";
import { combat } from "./content/Combat/combat";


const SM = getSMInstance();

const Actions = {

    init: function () {
        Actions.showActions();
    },

    showActions: function () {

        currentActionSet = getCurrentActions();

        const actionTextDiv = document.getElementById("actions");

        actionTextDiv.innerHTML = Actions.getActionDisplay(currentActionSet);

        const headerDiv = document.getElementById("actionsHeader");

        headerDiv.innerHTML = currentActionSet.actionTitle();

        const displayHeaderDiv = document.getElementById("displayHeader");

        displayHeaderDiv.innerHTML = currentActionSet.displayTitle();

    },

    sortCommandList: function (actions) {
        // AVAILABLE COMMANDS LIST:
        const commands = {};

        const sectionOrder = ['actions', 'commands', 'unread', 'inbox', 'archive', 'deleted',
        // DATABASE
        'personal notes', 'persons of interest', 
        'station', 'flight deck', 'my terminal', 'explore',
        'patrons',
        // WORLD
        'navigation', 'ship', 'location', 'ship storage', 
        ];

        // ACTIONS
        if (actions.available()) {
            for (const [key, value] of Object.entries(actions.getActionList())) {

                let hidden = false;
                // check if the action is hidden
                if (value.hidden instanceof Function) {
                    hidden == value.hidden();
                } else if (value.hidden != null){
                    hidden = value.hidden;
                }

                if (value.available() == true) {
                    commands[key] = value;
                }
            }
        }

        
        // Organize commands by section
        const commandsBySection = {};

        for (const commandName in commands) {
            const section = commands[commandName].section;

            if (!(section in commandsBySection)) {
                commandsBySection[section] = [];
            }

            commandsBySection[section].push(commands[commandName]);
        }

        // Include all sections in sortedCommandsBySection and sort them according to the predefined order
        const sortedCommandsBySection = {};

        sectionOrder.forEach(section => {
            if (commandsBySection[section]) {
                sortedCommandsBySection[section] = commandsBySection[section];
                delete commandsBySection[section]; // Remove the section from commandsBySection
            }
        });

        // Include any remaining sections not specified in the section order
        for (const section in commandsBySection) {
            sortedCommandsBySection[section] = commandsBySection[section];
        }

        let index = 1;

        // add dynamic command nubmers 
        for (const section in sortedCommandsBySection) {

            // add section
            sortedCommandsBySection[section].forEach(command => {

                command.dynamicNumber = null;

                if (command.showDynamicNubmer == true) {
                    command.dynamicNumber = index;
                    index++;
                }
            });
        }

        return sortedCommandsBySection;

    },

    getActionDisplay: function (actions) {
        let actionText = '';
        
        const sortedCommandsBySection = Actions.sortCommandList(actions);
        
        for (const section in sortedCommandsBySection) {

            // create section header
            actionText += '<h2>' + section + '</h2><br>';

            // add section
            sortedCommandsBySection[section].forEach(command => {

                let hidden = false;
                // check if the action is hidden
                if (command.hidden instanceof Function) {
                    hidden = command.hidden();
                } else if (command.hidden != null){
                    hidden = command.hidden;
                }

                let dynamicNumberText = '';

                if (command.dynamicNumber != null) {
                    dynamicNumberText = '[' + command.dynamicNumber + '] ';
                }

                if (hidden == false) {
                    if (command.displayName instanceof Function) {
                        actionText += dynamicNumberText + command.displayName() + '<br>';
                    } else {
                        actionText += dynamicNumberText + command.displayName + '<br>';
                    }
                }
                
            });
        }

        return actionText;
    },

    submitCommand: function (command) {

        if (command == 'log state') {
            console.log(SM.logState());
            Actions.showCommandResponse();
            return true;
        }

        if (command == 'log keywords') {
            let keywords = 0;
            Command.addCommandResponse('<hr>');
            Keywords.getKeywords().forEach(element => {
                Command.addCommandResponse(element);
                keywords++;
            });
            Command.addCommandResponse('<hr>' + keywords + ' total keywords have been unlocked.');
            
            Actions.showCommandResponse();
            return true;
            
        }

        let availableActions = getCurrentActions();
        let sortedActions = Actions.sortCommandList(availableActions);

        //let commandIndex = 0;

        let commandLowerCase = command.toLowerCase();

        for (const [key, actions] of Object.entries(sortedActions)) {

            for (const [key, value] of Object.entries(actions)) {

                if (value.available() == true) {
                    // PERFORM COMMAND
                    if (value.command(commandLowerCase) || value.dynamicNumber == command) {
                        value.action(commandLowerCase);
                        if (value.response != null) {
                            Command.addCommandResponse(value.response());
                        }
                        Actions.showActions();
                        Actions.showCommandResponse();
                        return true;
                    }
                }
            }
        }

        Actions.showActions();
        
        if (SM.getCurrentState() == 'clearance' 
        || SM.getCurrentState() == 'station' 
        || SM.getCurrentState() == 'username'
        || SM.getCurrentState() == 'conversation'
        || SM.getCurrentState() == 'database'
        || SM.getCurrentState() == 'messages'
        || SM.getCurrentState() == 'room'
        || SM.getCurrentState() == 'world')
        {
            // SERVER COMMANDS
            sendCommandToServer(command);
        } else {
            // Show error message

            if (availableActions.errorMessage instanceof Function) {
                Command.addCommandResponse(availableActions.errorMessage());
            } else {
                Command.addCommandResponse(availableActions.errorMessage);
            }

            // RIVE ERROR ANIMATION
            errorTrigger.fire();

            Actions.showCommandResponse();
            return false;
        }
        
    },

    showCommandResponse: function () {
        Command.responseText();
    },

    refreshCurrentActions: function () {
        Actions.showActions();
    },

    changeActionState: function (newState) {
        if (getCurrentActions() != null) {
            getCurrentActions().onExit();
        }
        SM.setPreviousState(SM.getCurrentState());
        SM.setCurrentState(newState);

        Command.addCommandResponse(getCurrentActions().entryCommandMessage());
        Display.displayMessage(getCurrentActions().entryDisplayMessage());
        getCurrentActions().onEntry();
        Actions.showActions();
    },

    applyFormating: function (inputString) {
        return formatStoryHtml(inputString, SM.getUsername());
    }
}


async function sendCommandToServer(command) {
    Command.loadingStarted();
    try {
        const response = await api.respond(createServerCommand(command));
        if (response.username != null) {
            Username.setUsername(response.username);
        }

        if (response.clearanceLevel != null) {
            Clearance.handleServerResponse(response.clearanceLevel);
        }

        if (response.keywords != null) {
            Keywords.handleServerResponse(response.keywords);
        }

        if (response.terminalMessages != null) {
            response.terminalMessages.forEach(element => {
                Command.addCommandResponse(element);
            });
        }

        if (response.messages != null) {
            Messages.handleServerResponse(response.messages);
        }

        if (response.newContext != null) {
            if (response.newContext == 'station') {
                Station.enterStation('reiner-station');
            }
        }

        if (response.changeRoom != null) {
            Rooms.changeRoomState(response.changeRoom);
        }

        Rooms.handleServerResponse(response);

        if (response.conversationResponse != null) {
            if (response.eventMoment == true) {
                Conversation.Actions.turnOffCharacterView();
                Display.displayMessage(response.conversationResponse);
            } else {
                Conversation.Actions.turnOnCharacterView();
                Display.displayMessage('"' + response.conversationResponse + '"');
            }

        }
        Database.handleServerResponse(response);

    } catch (error) {
        Command.addCommandResponse(apiErrorMessage(error));
        console.error('Command request failed', error.kind || error.name);
    } finally {
        Command.loadingComplete();
        Actions.showCommandResponse();
        Actions.refreshCurrentActions();
    }
}

function createServerCommand(command) {

    const username = Username.getUsername();
    const context = SM.getCurrentState();
    const character = SM.getConversation();
    const clearanceLevel = Clearance.getClearanceLevel();
    const keywords = Keywords.getKeywords();
    const room = Rooms.getCurrentRoomKey();
    const station = Station.getStationId();

    const localCoordinates = [world.map.currentLocation.col, world.map.currentLocation.row];
    const tileSetCoordinates = [world.map.currentTileSet.col, world.map.currentTileSet.row];
    
    const serverCommand = {
        command: command,
        username: username,
        context: context,
        room: room,
        station: station,
        character: character,
        clearanceLevel: clearanceLevel,
        keywords: keywords,
        localCoordinates: localCoordinates,
        tileSetCoordinates: tileSetCoordinates
    }

    return serverCommand;
}

export async function sendCombatCommandToServer(enemyKilled) {
    try {
        await api.combat(createServerCommand(enemyKilled));
    } catch (error) {
        Command.addCommandResponse('Combat logging could not be confirmed. Your game can continue. ' + apiErrorMessage(error));
        Actions.showCommandResponse();
        console.error('Combat request failed', error.kind || error.name);
    }
}

function getCurrentActions() {

    if (SM.checkCurrentState(Station.Actions.state)) {
        return Station.Actions;
    }

    if (SM.checkCurrentState(Messages.Actions.state)) {
        return Messages.Actions;
    }

    if (SM.checkCurrentState(Clearance.Actions.state)) {
        return Clearance.Actions;
    }

    if (SM.checkCurrentState(Rooms.Actions.state)) {
        return Rooms.Actions;
    }

    if (SM.checkCurrentState(Username.Actions.state)) {
        return Username.Actions;
    }

    if (SM.checkCurrentState(Database.Actions.state)) {
        return Database.Actions;
    }

    if (SM.checkCurrentState(ConnectionError.Actions.state)) {
        return ConnectionError.Actions;
    }

    if (SM.checkCurrentState(Conversation.Actions.state)) {
        return Conversation.Actions;
    }

    if (SM.checkCurrentState(world.actions.state)) {
        return world.actions;
    }

    if (SM.checkCurrentState(supplyDepot.actions.state)) {
        return supplyDepot.actions;
    }

    if (SM.checkCurrentState(combat.actions.state)) {
        return combat.actions;
    }

    /*
    // CHARACTERS
    if (SM.checkCurrentState('conversation')) {

        for (const key in Characters.characterList) {
            if (Characters.characterList.hasOwnProperty(key)) {
                const character = Characters.characterList[key];
                if (SM.getConversation() == character.state) {
                    return character;
                }
            }
        }
    }
    */

}

let currentActionSet = null;

export default Actions;