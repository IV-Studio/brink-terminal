import Command from "../command.js";
import Station from "./station.js";
import Actions from "../actions.js";
import Rooms from "./rooms.js";
import getSMInstance from '../statemanager.js';
import Clearance from "./clearance.js";
import { world } from "./Map/world.ts";

const SM = getSMInstance();

const Conversation = {
    Actions: {
        additionalActions: [],
        errorMessage: "Error: Did not recognize command.",
        state: 'conversation',
        actionTitle: () => Rooms.getCurrentRoom().title,
        displayTitle: () => 'Conversations',
        onEntry: function () { },
        onExit: function () {
            this.turnOffCharacterView();
        },
        turnOnCharacterView: function () {
            const characterDiv = document.getElementById('characterContainer');
            characterDiv.style.display = 'flex';
        },
        turnOffCharacterView: function () {
            const characterDiv = document.getElementById('characterContainer');
            characterDiv.style.display = 'none';
        },
        entryCommandMessage: function () {
            // Show character image
            const characters = SM.get('characters');
            const currentConversation = SM.getConversation();
            const currentCharacter = characters[currentConversation];

            const imgURL = currentCharacter.img;
            var img = document.getElementById('characterImage');
            img.src = imgURL;

            this.turnOnCharacterView();

            return currentCharacter.entryCommandMessage;
        },
        entryDisplayMessage: function () {
            const tavernCharacters = SM.get('characters');
            const currentConversation = SM.getConversation();
            const tavernCharacter = tavernCharacters[currentConversation];
            return '"' + tavernCharacter.entryDisplayMessage + '"'
        },
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return Conversation.Actions.actionList;
        },
        actionList: {
            'return': {
                command: function (command) {
                    return ['r', 'return'].includes(command);
                },
                displayName: function () {
                    return '[R]eturn to ' + Rooms.getCurrentRoom().title;
                },
                section: 'Actions',
                available: () => true,
                action: function () {
                    //const characterDiv = document.getElementById('characterContainer');
                    //characterDiv.style.display = 'none';
                    Actions.changeActionState(Rooms.Actions.state);
                }
            },
            // CHAPTER 3 CONVERSATION EVENTS
            'say': {
                command: function (command) {
                    return ['say'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 3 && SM.get('game.currentConversation') == 'armitage') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('event-room');
                }
            },
            'repaired': {
                command: function (command) {
                    return ['repaired'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 3 && SM.get('game.currentConversation') == 'oleg-ali') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('my-cargo-hold');
                }
            },
            'ship-engines': {
                command: function (command) {
                    return ['ship engines'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 3 && SM.get('game.currentConversation') == 'linus-farno') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Station.enterStation('reiner-station');
                    world.map.currentLocation.col = 5;
                    world.map.currentLocation.row = 5;
                    world.map.currentTileSet.col = 0;
                    world.map.currentTileSet.row = 0;
                    Command.addCommandResponse('<hr>When you come to, Linus is gone.<br><br>' +
                        'It doesn\'t take you long to realize that\'s because you\'re back on your ship.<br><br>' +
                        'And you\'re back at Reiner Station...');
                }
            },
            'crumpled': {
                command: function (command) {
                    return ['crumpled'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 3 && SM.get('game.currentConversation') == 'ryan-rogal') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('magnomi-warship');
                    Command.addCommandResponse('<hr>You have 1 new message.');
                }
            },
            'trigger': {
                command: function (command) {
                    return ['trigger'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 4 && SM.get('game.currentConversation') == 'bill-bendo') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('personal-quarters');
                }
            },
            'fragment': {
                command: function (command) {
                    return ['fragment'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 4 && SM.get('game.currentConversation') == 'oleg-ali') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('my-cargo-hold');
                    Command.addCommandResponse('<hr>A file has been added to your database.');
                }
            },
            'satisfied': {
                command: function (command) {
                    return ['satisfied'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 4 && SM.get('game.currentConversation') == 'sorelian-ai') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('data-vault');
                    Command.addCommandResponse('<hr>A file has been added to your database.');
                }
            },
            'chimes': {
                command: function (command) {
                    return ['chimes'].includes(command);
                },
                displayName: function () {
                    return 'asdf';
                },
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() == 4 && SM.get('game.currentConversation') == 'vanta-sae') {
                        return true;
                    } else {
                        return false;
                    }
                },
                hidden: true,
                action: function () {
                    Rooms.changeRoomState('sorelia-waystation-2');
                }
            },
        },
    },

}

export default Conversation;