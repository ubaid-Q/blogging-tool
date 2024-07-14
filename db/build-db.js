import Database from 'better-sqlite3';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables from .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = resolve(__dirname, 'blogging_tool.db');
const dbExists = existsSync(dbPath);
const db = new Database(dbPath);

const saltRounds = 10; // Number of salt rounds for bcrypt

async function initializeDatabase() {
  if (!dbExists) {
    const schema = readFileSync(resolve(__dirname, 'db_schema.sql'), 'utf8');
    db.exec(schema); // Execute schema SQL directly
    console.log('Database schema initialized.');
    await seedInitialData();
  } else {
    console.log('Database already exists. Skipping initialization.');
  }
}

async function seedInitialData() {
  // Retrieve initial data from environment variables
  const AUTHOR_NAME = process.env.AUTHOR_NAME;
  const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL;
  const BLOG_TITLE = process.env.BLOG_TITLE;
  const PASSWORD = process.env.PASSWORD;

  try {
    if (!AUTHOR_NAME || !AUTHOR_EMAIL || !BLOG_TITLE || !PASSWORD) {
      throw new Error('Missing required environment variables for seeding initial data.');
    }

    const hashedPassword = await bcrypt.hash(PASSWORD, saltRounds);

    const insertAuthor = db.prepare('INSERT INTO authors (name, email, password) VALUES (?, ?, ?)');
    const info = insertAuthor.run(AUTHOR_NAME, AUTHOR_EMAIL, hashedPassword);
    const authorId = info.lastInsertRowid;

    const insertSettings = db.prepare('INSERT INTO settings (blog_title, author_id) VALUES (?, ?)');
    insertSettings.run(BLOG_TITLE, authorId);

    console.log('Initial data inserted:');
    console.log(`Blog Title: ${BLOG_TITLE}`);
    console.log(`Author Name: ${AUTHOR_NAME}`);
    console.log(`Author Email: ${AUTHOR_EMAIL}`);
  } catch (err) {
    throw new Error(`Error seeding initial data: ${err}`);
  }
}

// Exporting the initialization function for use in other modules
export async function runDatabaseInitialization() {
  try {
    await initializeDatabase();
    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    db.close();
  }
}

// Ensure initialization when this script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runDatabaseInitialization();
}
