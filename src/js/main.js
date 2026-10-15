import Command from "./command.js";
import Actions from "./actions.js";
import Station from "./content/station.js";
import Clearance from "./content/clearance.js";
import getSMInstance from './statemanager.js';
import Username from "./content/username.js";
import Keywords from "./content/keywords.js";
import ConnectionError from "./content/connectionError.js";
import Messages from "./content/messages.js";
import { initializeEnemies } from "./content/Combat/enemies.ts";

// http://localhost:3001
// https://pacific-wildwood-12937-dbfccb51eaa2.herokuapp.com
export const server = "https://pacific-wildwood-12937-dbfccb51eaa2.herokuapp.com";
export let versionNumber = '1.60';

initializeEnemies();

const SM = getSMInstance();


window.onload = init;
window.stateManager = SM;


function init() {

  SM.setup();
  Keywords.init();
  Clearance.setClearanceLevel(-1);
  Command.init();
  Station.init();
  Username.init();
  Messages.init();

}

export let urlPath = '';

document.addEventListener('DOMContentLoaded', function() {
  const extraPath = window.location.pathname;

  let extraPathClean = extraPath.replace("/", "");

  urlPath = extraPathClean;

});

fetch(server + '/api/hello')
  .then(response => response.text())
  .then(data => {
    Actions.changeActionState(Username.Actions.state);
    Actions.init();
    Command.responseText();
  })
  .catch(err => {
    Actions.changeActionState(ConnectionError.Actions.state);
    console.log(ConnectionError.Actions.state);
    Actions.init();
    Command.responseText();
    console.error('Fetch error:', err);
  });

  /*
fetch(server + '/api/command-logs')
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Fetch error:', err);
  });

  */

// GRAIN EFFECT
function createGrain() {
  const grain = document.createElement('div');
  grain.classList.add('grain');
  document.body.appendChild(grain);
  return grain;
}

function jumpGrain(grain) {
  const x = Math.random() * (window.innerWidth - grain.clientWidth);
  const y = Math.random() * (window.innerHeight - grain.clientHeight);

  grain.style.left = `${x}px`;
  grain.style.top = `${y}px`;
}

const grains = [];
for (let i = 0; i < 10; i++) {
  const grain = createGrain();
  jumpGrain(grain);
  grains.push(grain);
}

setInterval(() => {
  grains.forEach(jumpGrain);
}, 100);

// TIME DATE
function getFormattedDateTime(now) {
  const year = now.getFullYear() + 3000;
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  const formattedDateTime = `${year}:${month}:${day} - ${hours}:${minutes}.${seconds}.${milliseconds}`;
  return formattedDateTime;
}

function updateTime() {
  const timerDiv = document.getElementById("timer");
  if (timerDiv) {
    timerDiv.innerText = getFormattedDateTime(new Date());
  }
}

export function convertDateTime(time) {
  return getFormattedDateTime(time);
}

setInterval(updateTime, 100);

// VIBRATE
export function vibrate() {
  if ('vibrate' in navigator) {
    // Vibrate for 200 milliseconds
    navigator.vibrate(200);
  } else {
    console.log('Vibration API not supported on this device.');
  }
}