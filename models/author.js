import Database from "better-sqlite3";

// Connect to SQLite database
const db = Database("./db/blogging_tool.db");

class Author {
  static getAllArticles(authorId) {
    const query = "SELECT * FROM articles WHERE author_id = ?";
    return db.prepare(query).all(authorId);
  }

  static getAuthorById(authorId) {
    const query = `
      SELECT author.*, s.blog_title AS blog_title 
      FROM authors AS author
      LEFT JOIN settings AS s ON author.id = s.author_id
      WHERE author.id = ?`;
    return db.prepare(query).get(authorId);
  }

  static updateAuthorSettings(authorId, blogTitle, authorName) {
    const updateAuthorQuery = "UPDATE authors SET name = ? WHERE id = ?";
    const updateSettingsQuery = "UPDATE settings SET blog_title = ? WHERE author_id = ?";

    const updateAuthorStmt = db.prepare(updateAuthorQuery);
    const updateSettingsStmt = db.prepare(updateSettingsQuery);

    db.transaction(() => {
      updateAuthorStmt.run(authorName, authorId);
      updateSettingsStmt.run(blogTitle, authorId);
    })();

    return { authorId, blogTitle, authorName };
  }
}

export default Author;
