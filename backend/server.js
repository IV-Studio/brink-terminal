const express = require('express');
const cors = require('cors');

const Clearance = require('./content/clearance');
const Keywords = require('./content/keywords');
const Station = require('./content/station');
const Messages = require('./content/messages');
const Database = require('./content/database');
const Characters = require('./content/characters');
const Logging = require('./logging');
const Rooms = require('./content/rooms');
const World = require('./content/world');

const path = require('path');

const { requireAdmin } = require('./admin-auth');
const { escapeHtml } = require('./shared/html.cjs');

function createApp(logging = Logging) {
  const app = express();
  app.disable('x-powered-by');

  // Allow all origins (use with caution in production)
  app.use(cors());

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Example endpoint
  app.get('/api/hello', (req, res) => {
    res.send('Server connection established successfully.');
  });

  app.post('/api/combat', (req, res) => {
    // Extract the text input from the request body
    const { command } = req.body;
    const { username } = req.body;
    const { context } = req.body;
    const { clearanceLevel } = req.body;
    const { keywords } = req.body;
    const { character } = req.body;
    const { room } = req.body;
    const { station } = req.body;
    const { localCoordinates } = req.body;
    const { tileSetCoordinates } = req.body;

    if (!command) {
      return res.status(400).send("No command provided");
    }

    /** @type {Partial<import('./shared/api').GameResponse>} */
    let response = {};

    response.terminalMessages = [];
    response.clearanceLevel = clearanceLevel;
    response.keywords = [];
    if (keywords != null) {
      response.keywords = keywords;
    }
    response.username = username;
    response.context = context;
    response.character = character;
    response.command = command;
    response.room = room;
    response.station = station;
    response.localCoordinates = localCoordinates ?? null;
    response.tileSetCoordinates = tileSetCoordinates ?? null;

    logging.logCombat(response);

    /*
    if (req.body != undefined) {
    
    }
    */
    res.send('combat event sent');
  });


  app.post('/api/respond', (req, res) => {

    // Extract the text input from the request body
    const { command } = req.body;
    const { username } = req.body;
    const { context } = req.body;
    const { clearanceLevel } = req.body;
    const { keywords } = req.body;
    const { character } = req.body;
    const { room } = req.body;
    const { station } = req.body;
    const { localCoordinates } = req.body;
    const { tileSetCoordinates } = req.body;

    if (!command) {
      return res.status(400).send("No command provided");
    }

    /** @type {Partial<import('./shared/api').GameResponse>} */
    let response = {};

    response.terminalMessages = [];
    response.clearanceLevel = clearanceLevel;
    response.keywords = [];
    if (keywords != null) {
      response.keywords = keywords;
    }
    response.username = username;
    response.context = context;
    response.character = character;
    response.command = command;
    response.room = room;
    response.station = station;
    response.localCoordinates = localCoordinates ?? null;
    response.tileSetCoordinates = tileSetCoordinates ?? null;

    // GAME START
    if (context == 'username') {
      const now = new Date();
      if (now < Clearance.clearanceLevelTimes[0]) {
        response.clearanceLevel = -1;
      } else {
        response.clearanceLevel = 0;
      }
      response.newContext = 'station';
      response.username = command;
      response.terminalMessages.push('...<br>...<br>...<br>' + 'Username confirmed: ' + escapeHtml(command));
    }

    if (context == 'clearance') {
      response = Clearance.checkClearance(response, command, username);
    }

    // KEYWORD CHECK

    if (context == 'station' || context == 'messages' || context == 'database' || context == 'room' || context == 'world') {
      response = Keywords.checkKeyword(response, command);
    } else {
      //response.keywords = keywords;
    }

    if (context == 'conversation') {
      response = Characters.conversationPrompt(response, command, character);
    }

    if (context == 'room') {
      response = Rooms.roomPrompt(response, command);
    }

    if (context == 'world') {
      response = World.worldCommand(response, command);
    }


    response = Keywords.checkSpecialKeywords(response);
    // CHARACTERS CHECK
    response = Characters.checkCharacters(response);

    // ADD AVAILABLE MESSAGES
    response = Messages.getAvailableMessages(response);

    // GET DATABASE ENTRIES
    response = Database.getAvailableEntries(response);

    // GET AVAILABLE ROOMS
    response = Rooms.getAvailableRooms(response);

    logging.logCommand(response);

    res.send(response);

  });

  app.get('/admin/logs', requireAdmin, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(__dirname, 'admin/logs.html'));
  });

  app.post('/api/admin/clearance', requireAdmin, (req, res) => {
    const level = req.body?.clearanceLevel;
    if (!Number.isInteger(level) || !Object.hasOwn(Clearance.clearanceCodes, level)) {
      return res.status(400).json({ error: 'Invalid clearance level' });
    }
    const response = { clearanceLevel: level, keywords: [] };
    Keywords.addCoreKeywords(response);
    res.json(response);
  });

  app.get('/api/command-logs', requireAdmin, async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      const info = await logging.getInfo();
      res.send(info);
    } catch (error) {
      console.error('Error fetching command logs:', error);
      res.status(500).send('An error occurred while fetching command logs');
    }
  });

  return app;
}

module.exports = { createApp };

if (require.main === module) {
  Logging.init();
  const app = createApp();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
