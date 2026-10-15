import { convertDateTime } from './formatting.js';
let started = false;
export function startTerminalEffects() {
  if (started) return;
  started = true;
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

  function updateTime() {
    const timer = document.getElementById('timer');
    if (timer) timer.innerText = convertDateTime(new Date());
  }
  updateTime();
  setInterval(updateTime, 100);
}
