// DATABASE: one shared connection pool, reused by every service.
// A pool keeps several connections open so each request doesn't need to reconnect.
import 'dotenv/config'; // loads variables from the .env file into process.env
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Without this handler, a dropped idle connection (e.g. PostgreSQL restarts) would crash the server.
pool.on('error', (err) => console.error('Idle database connection error:', err.message));

// Called once at startup to confirm PostgreSQL is reachable.
export async function verifyConnection(): Promise<void> {
  const result = await pool.query('SELECT NOW() AS now');
  console.log('Connected to PostgreSQL. Server time:', result.rows[0].now);
}
