const { Pool } = require('pg');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Retain the existing Heroku connection settings.
});

function createLogger(database, reportError = console.error) {
    async function insert(response, combat) {
        const values = [
            response.username,
            response.command,
            combat ? 'kill' : response.context,
            response.keywords,
            response.clearanceLevel,
            combat ? '' : response.character,
            combat ? '' : response.room,
            combat ? '' : response.station,
        ];
        try {
            const result = await database.query(`
                INSERT INTO command_logs (username, command, context, keywords, clearance_level, character, room, station)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `, values);
            return result.rows[0];
        } catch (error) {
            // Telemetry failure must not reject an unawaited promise or interrupt gameplay.
            reportError('Command logging failed', error.code || error.name);
            return null;
        }
    }

    return {
        init() {},
        logCommand(response) { return insert(response, false); },
        logCombat(response) { return insert(response, true); },
        getInfo() {
            // The Express route owns the HTTP response and handles query failures.
            return database.query(`
                SELECT command, context, username, clearance_level, timestamp, station, room
                FROM command_logs
                ORDER BY timestamp DESC
                LIMIT 20
            `);
        },
    };
}

process.on('SIGINT', () => {
    pool.end().then(() => process.exit(0)).catch(error => {
        console.error('Error closing connection pool:', error.code || error.name);
        process.exit(1);
    });
});

module.exports = { ...createLogger(pool), createLogger };
