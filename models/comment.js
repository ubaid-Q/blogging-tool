import Database from "better-sqlite3";

// Connect to SQLite database using better-sqlite3
const db = Database("./db/blogging_tool.db");

class Comment {
  static add(articleId, commenterName, comment) {
    const insertQuery = "INSERT INTO comments (article_id, commenter_name, comment) VALUES (?, ?, ?)";

    try {
      const statement = db.prepare(insertQuery);
      statement.run(articleId, commenterName, comment);
      return true;
    } catch (err) {
      throw new Error(`Error adding comment: ${err.message}`);
    }
  }
}

export default Comment;
