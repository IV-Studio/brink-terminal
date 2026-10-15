import { startApplication } from './startup.js';

startApplication().catch(error => {
  console.error('Terminal startup failed', error);
  document.getElementById('displayHeader').textContent = 'Unable to start';
  document.getElementById('displayText').textContent = 'The terminal could not load. Check your connection and refresh the page.';
});
