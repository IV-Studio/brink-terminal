import { nextHtmlIndex } from './html.js';
import Actions from "./actions.js";

const Display = {
    responseTyping: false,
    RESPONSE_SPEED: 3,
    init: function () {
        
    },
    displayMessage: function (text) {
        stopTypeWriter();
        let displayText = document.getElementById("displayText");

        let displayTextString = Actions.applyFormating(text);

        //actionTextDiv.innerHTML = text;
        displayText.innerHTML = '';
        responseString = displayTextString;
        typeWriter('displayText', displayTextString);
    }

}

let responseString = '';

let i = 0;

let typewriterTimer;

const typeWriter = (id, sentence, speed = 100) => {
    let index = 0;
    let element = document.getElementById(id);

    // Clear any existing timer before starting a new one
    clearInterval(typewriterTimer);

    // Store the interval in the global variable for later access
    typewriterTimer = setInterval(() => {
        index = nextHtmlIndex(sentence, index);
        element.innerHTML = sentence.slice(0, index);

        if (index >= sentence.length) {
            clearInterval(typewriterTimer);
        }
    }, Display.RESPONSE_SPEED);
};

// Function to stop the typewriter effect manually
const stopTypeWriter = () => {
    clearInterval(typewriterTimer);
};


export default Display;