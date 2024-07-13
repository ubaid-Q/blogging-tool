import Database from "better-sqlite3";

// Connect to SQLite database
const db = Database("./db/blogging_tool.db");

class Settings {
  static get() {
    const query = "SELECT * FROM settings s LEFT JOIN authors a ON a.id = s.author_id LIMIT 1 "; // Assuming settings table has only one row
    const row = db.prepare(query).get();
    return row;
  }
}

export default Settings;
