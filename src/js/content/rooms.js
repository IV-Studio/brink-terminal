import Station from "./station.js";
import Actions from "../actions.js";
import Clearance from "./clearance.js";
import { world } from "./Map/world";
import getSMInstance from '../statemanager.js';
import Messages from "./messages.js";
import Database from "./database.js";
import Keywords from "./keywords.js";
import { playerShip } from "./Ship/ships";
import { armory } from "./Stores/armory";
import Command from "../command.js";

const SM = getSMInstance();

const Rooms = {
    getRoomActions: function () {
        const rooms = SM.get('rooms');

        let actionList = {};

        // SHOW MESSAGES FROM SERVER

        for (const key in rooms) {
            const element = rooms[key];

            let room = {};

            room.displayName = element.displayName;

            room.section = element.section;

            room.command = function (command) {
                return (element.command.includes(command));
            };

            room.displayName = element.displayName;

            room.available = function () {
                if (element.stations != null) {
                    if (!element.stations.includes(Station.getStationId())) {
                        return false;
                    }
                }
                return element.available && element.contexts.includes(SM.getCurrentState());
            };
            room.action = function () {
                Rooms.changeRoomState(key);
            };

            room.showDynamicNubmer = false;

            actionList[element.key] = room;
        }

        return actionList;
    },
    changeRoomState: function (room) {
        SM.set('game.room', room);
        Actions.changeActionState(Rooms.Actions.state);
    },
    Actions: {
        additionalActions: [],
        errorMessage: '',
        state: 'room',
        actionTitle: () => Rooms.getCurrentRoom().actionTitle,
        displayTitle: () => Rooms.getCurrentRoom().title,
        onEntry: function () {
        },
        onExit: function () {

        },
        entryCommandMessage: function () { return '<hr>' + Rooms.getCurrentRoom().entryCommandMessage; },
        entryDisplayMessage: function () { return Rooms.getCurrentRoom().entryDisplayMessage },
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            const actions = {};

            const characters = SM.get('characters');

            for (const key in characters) {
                const element = characters[key];

                let correctStation = true;

                if (element.station != '' && element.station != null) {
                    if (element.station != Station.getStationId()) {
                        correctStation = false;
                    }
                }

                if (element.room == Rooms.getCurrentRoomKey() && correctStation) {
                    actions[key] = Rooms.createCharacterAction(element);
                }
            };

            let updatedActions = { ...actions, ...this.actionList };

            if ((Clearance.getClearanceLevel() >= 2) && (Rooms.getCurrentRoomKey() === 'hangar') && (Keywords.checkForKeyword('signal'))) {
                updatedActions = { ...updatedActions, ...playerShip.getHangarUpgradeActions() };
            } else if (Rooms.getCurrentRoomKey() === 'armory') {
                updatedActions = { ...updatedActions, ...armory.getActionList() };
            }


            return updatedActions;

        },
        actionList: {
            'leave': {
                command: function (command) {
                    return ['exit', 'x'].includes(command);
                },
                displayName: 'E[x]it',
                section: 'Actions',
                available: function () {
                    return true;
                },
                action: function () {
                    if (Rooms.getCurrentRoomKey() == 'med-bay') {
                        if (Keywords.checkForKeyword('rest')) {
                            Actions.changeActionState(Rooms.getCurrentRoom().exitActionState);
                        } else {
                            Command.addCommandResponse('You attempt to leave but you cannot yet muster the strength to stand. Perhaps you should take Bill\'s advice.');
                        }
                        return true;
                    } else {
                        Actions.changeActionState(Rooms.getCurrentRoom().exitActionState);
                    }

                },
            },
            'leave-station': {
                command: function (command) {
                    return ['t', 'take off', 'takeoff'].includes(command);
                },
                displayName: '[T]ake Off',
                section: 'Actions',
                available: function () {
                    if (Clearance.getClearanceLevel() >= 2 && Rooms.getCurrentRoomKey() == 'hangar' && Keywords.checkForKeyword('signal')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                action: function () {

                    Actions.changeActionState(world.actions.state);
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
                    return Rooms.getCurrentRoom().myTerminalAccess;
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
                    return Rooms.getCurrentRoom().myTerminalAccess;
                },
                action: function () {
                    Actions.changeActionState(Database.Actions.state);
                },
            },
            // UPGRADES
            /*
            'upgrade-max-health': {
                command: function (command) {
                    return ['upgrade health', 'upgrade max health'].includes(command);
                },
                displayName: playerShip.upgradeActionDisplay(),
                section: 'Ship Upgrades',
                available: function () {
                    if(Clearance.getClearanceLevel() >= 2 && Rooms.getCurrentRoomKey() == 'hangar' && Keywords.checkForKeyword('signal')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                action: function () {  
                    playerShip.upgradeMaxHealth();
                },
            },
            */
        },
    },
    createCharacterAction: function (character) {
        const person = {
            command: function (command) {
                return (command == character.command);
            },
            displayName: character.name,
            section: 'Patrons',
            showDynamicNubmer: true,
            hidden: false,
            available: function () {
                return true;
            },
            action: function () {
                SM.setConversation(character.key);
                Actions.changeActionState('conversation');
            }
        }
        return person;
    },
    handleServerResponse: function (response) {
        SM.set('characters', response.characters);
        SM.set('rooms', response.rooms)
    },
    getCurrentRoomKey: function () {
        return SM.get('game.room');
    },
    getCurrentRoom: function () {
        const currentRoomKey = Rooms.getCurrentRoomKey();
        const rooms = SM.get('rooms');
        const currentRoom = rooms[currentRoomKey];
        return currentRoom;
    }
}

export default Rooms;