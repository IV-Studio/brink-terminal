import Command from "../command.js";
import Station from "./station.js";
import Actions from "../actions.js";
import Display from "../display.js";
import Characters from "./characters.js";
import Files from "./files.js";
import getSMInstance from '../statemanager.js';
import AudioPlayer from '../audioPlayer.js';
import Rooms from "./rooms.js";

const SM = getSMInstance();

const Database = {
    Actions: {
        additionalActions: [],
        errorMessage: "Error: Did not recognize command.",
        state: 'database',
        actionTitle: () => 'Database',
        displayTitle: () => 'File Display',
        onEntry: function () { },
        onExit: function () {
            Database.closeImageView();
            AudioPlayer.disableAudioPlayer();
        },
        entryCommandMessage: function () { return '<hr>Loading Database...<br>...<br>...<br><br>Loading complete.' },
        entryDisplayMessage: function () { return 'No file selected' },
        available: function () {
            return SM.checkCurrentState(this.state);
        },
        getActionList: function () {
            return this.actionList;
        },
        
        getActionList: function () {

            const actions = {};

            const characters = SM.get('database.characterFiles');

            for (const key in characters) {
                if (characters.hasOwnProperty(key)) {
                    const character = characters[key];
                    actions[key] = Database.createPersonOfInterestAction(character);
                }
            }

            const files = SM.get('database.files');

            for (const key in files) {
                if (files.hasOwnProperty(key)) {
                    const file = files[key];
                    actions[key] = Database.createFileAction(file, key);
                }
            }

            return {... actions, ... this.actionList, ...AudioPlayer.actionList};
        },
        actionList: {
            'quit': {
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
            }
        }
    },
    createPersonOfInterestAction: function (character) {
        const person = {
            command: function (command) {
                return (character.command.includes(command));
            },
            displayName: character.name,
            section: 'Persons Of Interest',
            showDynamicNubmer: false,
            hidden: false,
            available: function () {
                return true;
            },
            action: function () {
                AudioPlayer.disableAudioPlayer();
                Database.closeImageView();

                Command.addCommandResponse('Loading file for "' + character.name + '"');
                Display.displayMessage(Characters.getCharacterInfo(character));
                Database.setupImageView(character.img);
            },
        }
        return person;
    },
    createFileAction: function (file, key) {
        const returnFile = {
            command: function () {
                return false;
            },
            displayName: function () {
                const entryRead = Database.checkIfRead(key);
                if (entryRead) {
                    return "<span class='read'>" +file.name + "</span>";
                } else {
                    return file.name
                }
            },
            section: file.section,
            showDynamicNubmer: true,
            hidden: false,
            available: function () {
                return true;
            },
            action: function () {
                // Reset
                AudioPlayer.disableAudioPlayer();
                Database.closeImageView();

                Command.addCommandResponse('Loading file "' + file.name + '"');
                Display.displayMessage(file.body);

                if (file.img != null) {
                    if (file.filetype == 'Image') {
                        Database.setupLargeImageView(file.img);
                    } else {
                        Database.setupImageView(file.img);
                    }
                }

                if (file.audio != null) {
                    AudioPlayer.enableAudioPlayer(file.audio, file.name, Actions.applyFormating(file.transcript));
                }
                
                Database.markEntryAsRead(key);
            },
            message: {
                mainText: Files.getFileInfo(file),
            }
        }
        return returnFile;
    },
    setupImageView: function (imageSource) {
        var img = document.getElementById('characterImage');
        img.src = imageSource;
        const characterDiv = document.getElementById('characterContainer');
        characterDiv.style.display = 'flex';
    },
    setupLargeImageView: function (imageSource) {
        var img = document.getElementById('databaseImage');
        img.src = imageSource;
        const characterDiv = document.getElementById('databaseImageContainer');
        characterDiv.style.display = 'flex';
    },
    closeImageView: function () {
        const characterDiv = document.getElementById('characterContainer');
        characterDiv.style.display = 'none';

        const imgDiv = document.getElementById('databaseImageContainer');
        imgDiv.style.display = 'none';
    },
    handleServerResponse: function (response) {
        SM.set('database.characterFiles', response.characterFiles);
        SM.set('database.files', response.files);
    },
    markEntryAsRead: function(entryKey) {
        let readEntries = SM.get('database.read');
        if (readEntries == null) {
            readEntries = [entryKey];
            SM.set('database.read', readEntries);
        } else {
            if (!readEntries.includes(entryKey)) {
                // If not, add 'myString' to 'myArray'
                readEntries.push(entryKey);
              }
        }
        SM.set('database.read', readEntries);
    },
    checkIfRead: function(entryKey) {

        const readEntries = SM.get('database.read');

        if (readEntries == null) {
            return false;
        } else {
            if (readEntries.includes(entryKey)) {
                return true;
            } else {
                return false;
            }
        }
    },
}

export default Database;