import pg from 'pg'; // Default import
const { Pool } = pg; // Destructure Pool from the default export
import 'dotenv/config';
import process from 'process';

// Ensure environment variables are loaded
if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
  console.error('Missing required environment variables in .env');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err.stack);
  process.exit(1);
});

// Initialize database
const initDb = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user'
        )
      `);
      console.log('Users table initialized');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error initializing database:', err.stack);
    process.exit(1);
  }
};

initDb();

export default pool;