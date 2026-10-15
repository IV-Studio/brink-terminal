import Rooms from "./rooms.js";
import Actions from "../actions.js";
import Display from "../display.js";
import Station from './station.js';
import getSMInstance from '../statemanager.js';
const SM = getSMInstance();

const Characters = {
    returnToPreviousState: function () {
        Actions.changeActionState(Rooms.Actions.state);
    },
    setupCharacterView: function (character) {
        var img = document.getElementById('characterImage');
        img.src = character.img;
        const characterDiv = document.getElementById('characterContainer');
        characterDiv.style.display = 'flex';
    },
    closeCharacterView: function () {
        const characterDiv = document.getElementById('characterContainer');
        characterDiv.style.display = 'none';
    },
    displayMessage: function (message) {
        Display.displayMessage('"' + message + '"');
    },
    defaultErrorMessage: function (character) {
        return character.displayTitle() + " doesn't seem to know anything about that.";
    },
    getCharacterInfo: function (character, response) {

        const info = "Name: " + character.name + "<br>" +
            "Faction: " + character.faction + "<br>" +
            "Height: " + character.height + "<br>" +
            "Role: " + character.role + "<br><hr>" +
            "Notes: <br>" + character.notes + "<br>";

        return info;
    },
    conversationTitle: 'Conversation',
}

function chooseRandomString(strings) {
    if (strings.length === 0) {
        console.warn("random string array is empty");
        return '';
    }
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}


export default Characters;