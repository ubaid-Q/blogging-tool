import Database from 'better-sqlite3';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import readlineSync from 'readline-sync'; // Import readline-sync for synchronous input

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
  // Prompt for author and blog settings interactively
  let AUTHOR_NAME = readlineSync.question('Enter Author Name: ');
  let AUTHOR_EMAIL = '';
  let BLOG_TITLE = '';
  let PASSWORD = '';

  // Validate and prompt for email until valid format
  while (!AUTHOR_EMAIL) {
    AUTHOR_EMAIL = readlineSync.questionEMail('Enter Author Email: ', {
      limitMessage: 'Please enter a valid email address.',
    });
  }

  // Prompt for blog title
  while (!BLOG_TITLE) {
    BLOG_TITLE = readlineSync.question('Enter Blog Title: ');
  }

  // Validate and prompt for password until meets requirements
  while (!PASSWORD) {
    PASSWORD = readlineSync.question('Enter Password (at least 8 characters): ', {
      hideEchoBack: true, // Hide user input for password
      min: 8, // Minimum password length
      limitMessage: 'Password must be at least 8 characters long.',
    });
  }

  try {
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
