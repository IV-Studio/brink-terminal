const { Pool } = require('pg');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necessary for Heroku's SSL requirements
    },
});

const Logging = {
    init: function () {
        /*
        client.connect()
            .then(() => console.log('Connected to database'))
            .catch((err) => console.error('Connection error', err));
            */
    },
    logCommand: function (response) {

        const { command } = response;
        const { username } = response;
        const { context } = response;
        const { clearanceLevel } = response;
        const { keywords } = response;
        const { character } = response;
        const { room } = response;
        const { station } = response;

        const newCommandLog = {
            username: username,
            command: command,
            context: context,
            keywords: keywords,
            clearance_level: clearanceLevel,
            character: character,
            room: room,
            station: station
        };

        // Insert the new command log
        insertCommandLog(newCommandLog).then((entry) => {
            console.log('Successfully added:', entry);
        });
    },
    logCombat: function (response) {

        //console.log('loggin combat ' + response.command);
        const { command } = response;
        const { username } = response;
        const { context } = 'kill';
        const { clearanceLevel } = response;
        const { keywords } = response;
        const { character } = '';
        const { room } = '';
        const { station } = '';

        const newCommandLog = {
            username: username,
            command: command,
            context: context,
            keywords: keywords,
            clearance_level: clearanceLevel,
            character: character,
            room: room,
            station: station
        };

        // Insert the new command log
        insertCommandLog(newCommandLog).then((entry) => {
            console.log('Successfully added:', entry);
        });
    },
    getInfo: async function () {
        try {
            const result = await pool.query(`
              SELECT command, context, username, clearance_level, timestamp, station, room
              FROM command_logs
              ORDER BY timestamp DESC
              LIMIT 20
            `);
            return result;
            //res.json(result.rows);
          } catch (err) {
            console.error('Error executing query', err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return err;
          }
    }
}

const insertCommandLog = async (data) => {
    const { username, command, context, keywords, clearance_level, character, room, station } = data;

    
    const insertQuery = `
      INSERT INTO command_logs (username, command, context, keywords, clearance_level, character, room, station)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [username, command, context, keywords, clearance_level, character, room, station];

    {
        try {
            const result = await pool.query(insertQuery, values);
            console.log('Inserted entry:', result.rows[0]);
            return result.rows[0];  // Return the inserted entry for further processing
        } catch (error) {
            console.error('Error inserting into command_logs:', error);
            throw error;  // Rethrow the error for further handling
        }
    }
};


process.on('SIGINT', () => {
    console.log('Received SIGINT. Attempting to close connection pool...');

    // Attempt to close the pool and then exit the process
    pool.end().then(() => {
        console.log('Connection pool closed');
        process.exit(0); // Gracefully exit the process with status code 0
    }).catch((err) => {
        console.error('Error closing connection pool:', err);
        process.exit(1); // Exit with a non-zero status code if there's an error
    });
});

module.exports = Logging;