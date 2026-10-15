import Actions from './actions.js';
import { nextHtmlIndex } from './html.js';

let inputBound = false;
let input = '';
let prompt;
let responseElement;
let responseString = '';
let responseIndex = 0;
let timer;

const Command = {
  RESPONSE_SPEED: 10,
  responseTyping: false,
  loading: false,
  messageQueue: [],

  init() {
    Command.getCommandDiv().focus();
    if (!inputBound) {
      window.addEventListener('keydown', event => Command.keyPress(event.key));
      inputBound = true;
    }
  },
  getCommandDiv() { return document.getElementById('command-prompt'); },
  scrollToBottom() {
    const terminal = Command.getCommandDiv();
    while (terminal.textContent.length > 5000 && terminal.firstChild !== responseElement && terminal.firstChild !== prompt) {
      terminal.firstChild.remove();
    }
    terminal.scrollTop = terminal.scrollHeight;
  },
  addCommandResponse(response) { Command.messageQueue.push(Actions.applyFormating(response)); },
  loadingStarted() { Command.loading = true; },
  loadingComplete() { Command.loading = false; },

  responseText() {
    const text = Command.messageQueue.map(message => message + '<br>').join('');
    Command.messageQueue.length = 0;
    if (Command.responseTyping) {
      responseString += text;
      return;
    }
    if (!text) { if (!prompt) renderPrompt(); return; }
    if (prompt) { prompt.remove(); prompt = undefined; }
    responseString = text;
    responseIndex = 0;
    responseElement = document.createElement('span');
    Command.getCommandDiv().append(responseElement);
    Command.responseTyping = true;
    typeWriter();
  },

  keyPress(key) {
    if (Command.loading) return;
    if (Command.responseTyping) {
      if (key.length === 1) {
        clearTimeout(timer);
        responseIndex = responseString.length;
        typeWriter();
      } else return;
    }
    if (key === 'Enter') {
      const command = input;
      if (prompt) {
        prompt.textContent = '>' + input;
        prompt.removeAttribute('data-terminal-input');
        prompt = undefined;
      }
      Command.getCommandDiv().append(document.createElement('br'));
      input = '';
      Actions.submitCommand(command);
    } else if (key === 'Backspace') {
      input = input.slice(0, -1);
      renderPrompt();
    } else if (key.length === 1) {
      input += key;
      renderPrompt();
    }
  },
};

function renderPrompt() {
  if (!prompt) {
    prompt = document.createElement('span');
    prompt.dataset.terminalInput = '';
    Command.getCommandDiv().append(prompt);
  }
  // Input is always text; never parse player commands as markup.
  prompt.textContent = '>' + input + '|';
  Command.scrollToBottom();
}

function typeWriter() {
  clearTimeout(timer);
  if (responseIndex < responseString.length) {
    responseIndex = nextHtmlIndex(responseString, responseIndex);
  }
  responseElement.innerHTML = responseString.slice(0, responseIndex);
  Command.scrollToBottom();
  if (responseIndex < responseString.length) {
    timer = setTimeout(typeWriter, Command.RESPONSE_SPEED);
  } else {
    Command.responseTyping = false;
    responseString = '';
    renderPrompt();
  }
}

export default Command;
