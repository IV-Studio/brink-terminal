import Command from './command.js';

let caps = false;
let numbers = false;
let keyboard;
let errorTrigger;
let brinkLogoReveal;
let initialization;
let keyboardEnabled = false;
export function enableRiveKeyboard() {
  if (!keyboardEnabled) {
    keyboard.on('riveevent', riveKeyboardEventHandler);
    keyboardEnabled = true;
  }
}

export function initializeRiveUI() {
  return initialization ??= loadRiveUI();
}

function loadRiveUI() {
  const keyboardReady = new Promise((resolve, reject) => {
    keyboard = new rive.Rive({
      src: 'https://ucarecdn.com/00c4e9ab-1cda-477a-a051-439e58ac19ec/brinkterminal_v1.riv',
      canvas: document.getElementById('keyboard'),
      autoplay: true,
      artboard: 'Keyboard',
      stateMachines: 'State Machine 1',
      onLoad: () => {
        keyboard.resizeDrawingSurfaceToCanvas();
        errorTrigger = keyboard.stateMachineInputs('State Machine 1').find(input => input.name === 'Error');
        resolve();
      },
      onLoadError: () => reject(new Error('Keyboard animation failed to load')),
    });
  });
  const logoReady = new Promise((resolve, reject) => {
    const logo = new rive.Rive({
      src: 'https://ucarecdn.com/1c8a1be3-ffe7-4863-94be-6db9f7c8d15f/brink_logo_v11.riv',
      canvas: document.getElementById('riveDisplay'),
      autoplay: true,
      stateMachines: 'State Machine 1',
      onLoad: () => {
        logo.resizeDrawingSurfaceToCanvas();
        brinkLogoReveal = logo.stateMachineInputs('State Machine 1').find(input => input.name === 'reveal');
        resolve();
      },
      onLoadError: () => reject(new Error('Logo animation failed to load')),
    });
  });
  return Promise.all([keyboardReady, logoReady]);
}

const riveKeyboardEventHandler = (event) => {

  const eventData = event.data;
  const eventProperties = eventData.properties;

  if (eventProperties != null) {
    
    if (numbers == true) {
      if (eventProperties['number'] != null) {
        Command.keyPress(eventProperties['number']);
      }
    } else {
      if (caps == true) {
        if (eventProperties['uppercase'] != null) {
          Command.keyPress(eventProperties['uppercase']);
        }

      } else {
        if (eventProperties['value'] != null) {
          console.log(eventProperties['value']);
          Command.keyPress(eventProperties['value']);
        }
      }
    }

    if (eventProperties['capsOn'] != null) {
      caps = eventProperties['capsOn'];
    }

    if (eventProperties['numbers'] != null) {
      numbers = eventProperties['numbers'];
    }

  }
  

}


export { keyboard, errorTrigger, brinkLogoReveal };
