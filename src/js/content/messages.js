import Command from "../command.js";
import Station from "./station.js";
import Actions from "../actions.js";
import Display from "../display.js";
import Keywords from "./keywords.js";
import getSMInstance from '../statemanager.js';
import Username from "./username.js";
import Clearance from "./clearance.js";
import Rooms from "./rooms.js";

const SM = getSMInstance();

const Messages = {
    init: function () {
        SM.set('messages.showArchive', false);
        SM.set('messages.showDeleted', false);
    },
    Actions: {
        additionalActions: [],
        errorMessage: "Error: Did not recognize command.",
        state: 'messages',
        actionTitle: () => 'Messages',
        displayTitle: () => 'Message Display',
        onEntry: function () {},
        onExit: function () {},
        entryCommandMessage: function () {return '<hr>Loading [Messages v0.291.1a]. You have ' + Messages.getTotalMessageCount() + ' unread message(s).'},
        entryDisplayMessage: function () {return 'No message selected'},
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return Messages.createActionList();
        }, 
    },
    createActionList: function () {

        const messages = SM.get('messages.messageList');

        let actionList = {};

        //let messageindex = 0;

        // SHOW MESSAGES FROM SERVER

        for (const key in messages) {
            const element = messages[key];

            let message = {};

            const messageRead = Messages.checkIfRead(key);

            message.body = element.body;
            
            message.section = element.section;

            if (messageRead || message.section == 'archive' || message.section == 'deleted') {
                message.displayName = "<span class='read'>" +element.subject + "</span>";
            } else {
                message.displayName = element.subject;
            }
            
        
            if (messageRead == false && message.section == 'inbox') {
                message.section = 'unread';
            }

            message.command = function () {
                return false;
            };

            message.available = function () {
                return true;
            };
            message.action = function () {
                Command.addCommandResponse('Opening message"' + element.subject +'"');
                Messages.markMessageAsRead(key);
                const emailHeader =
                'From: @' + element.sender + '<br>' +
                'To: @' + Username.getUsername() + '<br>' +
                "<hr>" +
                '<u>' + element.subject + '</u><br><br>';
                Display.displayMessage(emailHeader + element.body);
            };

            message.showDynamicNubmer = true;
            
            // HIDE IF ITS DELETED OR ARCHIVED
            let showMessage = true;

            if (message.section == 'deleted' && SM.get('messages.showDeleted') == false) {
                showMessage = false;
            }

            if (message.section == 'archive' && SM.get('messages.showArchive') == false) {
                showMessage = false;
            }

            if (showMessage == true) {
                actionList[element.key] = message;
            }
            //messageindex++;
        };

        
        const quit = {
            command: function (command) {
                return ['quit', 'q'].includes(command);
            },
            displayName: '[Q]uit',
            section: 'commands',
            available: function () {
                return true;
            },
            action: function () {
                if (SM.getPreviousState() == 'room') {
                    Rooms.changeRoomState(SM.get('game.room'));
                } else {
                    Actions.changeActionState(Station.Actions.state);
                }
                
            },
        };

        actionList.quit = quit;

        // ARCHIVE MESSAGES

        let showArchive = {
            command: function (command) {
                return ['show archive'].includes(command);
            },
            displayName: '[Show Archive]',
            section: 'commands',
            hidden: true,
            available: function () {
                return true;
            },
            action: function () {
                Command.addCommandResponse("Showing archived messages.");
                SM.set('messages.showArchive', true);
            },
        }

        if (Clearance.getClearanceLevel() >= 1 && SM.get('messages.showArchive') == false) {
            showArchive.hidden = false;
        }

        actionList.showArchive = showArchive;

        let hideArchive = {
            command: function (command) {
                return ['hide archive'].includes(command);
            },
            displayName: '[Hide Archive]',
            section: 'commands',
            hidden: true,
            available: function () {
                return true;
            },
            action: function () {
                Command.addCommandResponse("Hiding archived messages.");
                SM.set('messages.showArchive', false);
            },
        }

        if (Clearance.getClearanceLevel() >= 1 && SM.get('messages.showArchive') == true) {
            hideArchive.hidden = false;
        }

        actionList.hideArchive = hideArchive;

        // DELETED MESSAGES

        const showDeleted = {
            command: function (command) {
                return ['show deleted', 'show trash'].includes(command);
            },
            displayName: '',
            section: 'commands',
            hidden: true,
            available: function () {
                return true;
            },
            action: function () {
                Command.addCommandResponse("Showing deleted messages.");
                SM.set('messages.showDeleted', true);
            },
        }

        actionList.showDeleted = showDeleted;

        const hideDeleted = {
            command: function (command) {
                return ['hide deleted', 'hide trash'].includes(command);
            },
            displayName: '',
            section: 'commands',
            hidden: true,
            available: function () {
                return true;
            },
            action: function () {
                Command.addCommandResponse("Hiding deleted messages.");
                SM.set('messages.showDeleted', false);
            },
        }

        actionList.hideDeleted = hideDeleted;
        
        return actionList;
    },
    getTotalMessageCount: function() {

        const messages = SM.get('messages.messageList');

        let messageCount = 0;

        for (const key in messages) {

            if (!Messages.checkIfRead(key) && messages[key].section == 'inbox'){
                messageCount++;
            }
        }

        return messageCount;

    },
    showMessage: function (message) {

    },
    markMessageAsRead: function(messageKey) {
        let readMessages = SM.get('messages.read');
        if (readMessages == null) {
            readMessages = [messageKey];
            SM.set('messages.read', readMessages);
        } else {
            if (!readMessages.includes(messageKey)) {
                // If not, add 'myString' to 'myArray'
                readMessages.push(messageKey);
              }
        }
        SM.set('messages.read', readMessages);
    },
    checkIfRead: function(messageKey) {

        const readMessages = SM.get('messages.read');

        if (readMessages == null) {
            return false;
        } else {
            if (readMessages.includes(messageKey)) {
                return true;
            } else {
                return false;
            }
        }
    },
    handleServerResponse: function (incomingMessages) {
        SM.set('messages.messageList', incomingMessages);
    },
}

export default Messages;