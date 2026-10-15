import Actions from "./actions.js";

const Command = {

    RESPONSE_SPEED: 10,
    responseTyping: false,
    loading: false,

    messageQueue: [''],

    init: function () {
        const commandText = Command.getCommandDiv();
        commandText.focus();
        if (!inputBound) {
            window.addEventListener('keydown', handleKeyDown);
            inputBound = true;
        }
    },

    getCommandDiv: function () {
        return document.getElementById("command-prompt");
    },

    scrollToBottom: function () {
        const commandText = Command.getCommandDiv();
        const maxCharCount = 5000;

        // Check if the character count is above the limit
        if (commandText.innerHTML.length > maxCharCount) {
            // Remove characters from the beginning to reduce the count to the limit
            commandText.innerHTML = commandText.innerHTML.slice(-maxCharCount);
        }

        commandText.scrollTop = commandText.scrollHeight;
    },

    addCommandResponse: function (response) {
        Command.messageQueue.push(Actions.applyFormating(response));
    },

    loadingStarted: function () {
        Command.loading = true;
    },

    loadingComplete: function () {
        Command.loading = false;
    },

    responseText: function () {
        for (let j = 0; j < Command.messageQueue.length; j++) {

            responseString += Command.messageQueue[j];
            responseString += '<br>';
        }
        Command.messageQueue.length = 0;

        startTypewriterEffect();
    },

    keyPress: function (e) {

        if (Command.loading == true) return;

        const commandText = Command.getCommandDiv();

        if (e != "Shift" &&
            e != "Meta" &&
            e != "Alt" &&
            e != "Control" &&
            e != "Tab" &&
            e != "ArrowRight" &&
            e != "ArrowLeft" &&
            e != "ArrowUp" &&
            e != "Escape" &&
            e != "Capslock" &&
            e != "ArrowDown") {

            if (e == 'Enter') {
                if (Command.responseTyping) return;
                const command = getRecentCommand(commandText.innerHTML);

                commandText.innerHTML = commandText.innerHTML.slice(0, -1);
                commandText.innerHTML += '<br/>';

                Actions.submitCommand(command);

            } else if (e == 'Backspace') {
                if (Command.responseTyping) return;
                commandText.innerHTML = commandText.innerHTML.slice(0, -2);
                commandText.innerHTML += '|';
            } else {
                if (e.length <= 1) {

                    if (Command.responseTyping) {
                        extraLetter = e;
                        skipTypewriterEffect();
                    } else {
                        commandText.innerHTML = commandText.innerHTML.slice(0, -1);
                        commandText.innerHTML += e;
                        commandText.innerHTML += '|';
                    }
                }
            }
        }
    },
}


let i = 0;
let responseString = ""; // Initialize responseString if it's not already initialized
let skipTypewriter = false; // Flag to control skipping the typewriter effect
let typewriterFinished = false; // Flag to indicate if typewriter has finished
let extraLetter = '';

function typeWriter() {
    Command.responseTyping = true;

    const commandText = Command.getCommandDiv();

    while (i < responseString.length) {
        if (skipTypewriter) {
            // Skip typewriter effect and display remaining text immediately
            commandText.innerHTML += responseString.slice(i);
            break;
        }

        const char = responseString.charAt(i);

        // Check if we're at the start of an HTML tag
        if (responseString.charAt(i) === '<') {
            let tag = '';
            // Collect all characters until we reach the end of the tag
            while (i < responseString.length && responseString.charAt(i) !== '>') {
                tag += responseString.charAt(i);
                i++;
            }
            tag += '>'; // Include the closing '>'
            commandText.innerHTML += tag;
        } else {
            // Append the character if it's not part of an HTML tag
            commandText.innerHTML += responseString.charAt(i);
        }

        Command.scrollToBottom();
        i++;

        // Ensure we don't loop infinitely
        if (responseString.charAt(i - 1) !== '>') {
            setTimeout(typeWriter, Command.RESPONSE_SPEED);
            return; // Exit function and wait for the next timeout
        }
    }

    // Reset and finalize the command once we've processed all characters or skipped
    if (i >= responseString.length || skipTypewriter) {
        if (!typewriterFinished) {
            commandText.innerHTML += '>|';
            Command.scrollToBottom();
            typewriterFinished = true; // Set the flag to indicate finalization
        }
        i = 0;
        Command.responseTyping = false;
        responseString = '';
        skipTypewriter = false;

        if (extraLetter != '') {
            Command.keyPress(extraLetter);
            extraLetter = '';
        } // Reset the flag
    }
}

// Function to handle key press event
function skipTypewriterEffect() {
    if (Command.responseTyping) {
        skipTypewriter = true;
        typeWriter(); // Call typeWriter immediately to process remaining text
    }
}

function startTypewriterEffect() {
    typewriterFinished = false; // Reset the finished flag
    typeWriter();
}


let inputBound = false;
function handleKeyDown(e) {
    Command.keyPress(e.key);
}


function getRecentCommand(str) {
    const words = str.split('>');
    const command = words[words.length - 1];
    return command.slice(4, -1);
}

function getRandomElementFromArray(arr) {
    // Generate a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * arr.length);
    // Return the random element from the array
    return arr[randomIndex];
}


export default Command;