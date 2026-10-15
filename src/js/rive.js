//import * as rive from "@rive-app/canvas";
import Command from "./command.js";

const canvasElement = document.getElementById("keyboard");

let caps = false;
let numbers = false;

let errorTrigger;

let brinkLogoReveal;

const keyboard = new rive.Rive({
    src: "https://ucarecdn.com/00c4e9ab-1cda-477a-a051-439e58ac19ec/brinkterminal_v1.riv",
    canvas: canvasElement,
    autoplay: true,
    artboard: "Keyboard",
    stateMachines: "State Machine 1",
    onLoad: () => {
      keyboard.resizeDrawingSurfaceToCanvas();
      const inputs = keyboard.stateMachineInputs('State Machine 1');
      errorTrigger = inputs.find(i => i.name === 'Error');
    },
});


const j = new rive.Rive({
  // was v3
    src: "https://ucarecdn.com/1c8a1be3-ffe7-4863-94be-6db9f7c8d15f/brink_logo_v11.riv",
    canvas: document.getElementById("riveDisplay"),
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
      j.resizeDrawingSurfaceToCanvas();
      const inputs = j.stateMachineInputs('State Machine 1');
      brinkLogoReveal = inputs.find(i => i.name === 'reveal');
    },
});

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

keyboard.on("riveevent", riveKeyboardEventHandler);

export {keyboard, errorTrigger, brinkLogoReveal};
