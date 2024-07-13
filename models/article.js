import Database from 'better-sqlite3';

const db = new Database('./db/blogging_tool.db');

class Article {
  static getAllPublished() {
    try {
      const rows = db.prepare(`
        SELECT articles.*, authors.name as author_name
        FROM articles
        INNER JOIN authors ON articles.author_id = authors.id
        WHERE articles.published_at IS NOT NULL
      `).all();
      return Promise.resolve(rows);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static getAllDraft() {
    try {
      const rows = db.prepare("SELECT * FROM articles WHERE published_at IS NULL").all();
      return Promise.resolve(rows);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static getById(articleId) {
    try {
      const row = db.prepare(`
        SELECT articles.*, authors.name AS author_name
        FROM articles
        INNER JOIN authors ON articles.author_id = authors.id
        WHERE articles.id = ?
      `).get(articleId);
      return Promise.resolve(row);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static update(articleId, title, content) {
    try {
      db.prepare("UPDATE articles SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(title, content, articleId);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static delete(articleId) {
    try {
      db.prepare("DELETE FROM articles WHERE id = ?").run(articleId);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async create(authorId) {
    const insertQuery = "INSERT INTO articles (author_id, title, content) VALUES (?, ?, ?)";
    const selectQuery = "SELECT * FROM articles WHERE id = last_insert_rowid()";

    try {
      // Insert new article
      const result = db.prepare(insertQuery).run(authorId, "New Article", "");
      const newArticleId = result.lastInsertRowid;

      // Retrieve the newly created article
      const newArticle = db.prepare(selectQuery).get();
      return newArticle;
    } catch (err) {
      throw new Error(`Error creating new article: ${err.message}`);
    }
  }

  static publish(articleId) {
    try {
      db.prepare("UPDATE articles SET published_at = CURRENT_TIMESTAMP WHERE id = ?").run(articleId);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static incrementViews(articleId) {
    try {
      db.prepare("UPDATE articles SET views = views + 1 WHERE id = ?").run(articleId);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static like(articleId) {
    try {
      db.prepare("UPDATE articles SET likes = likes + 1 WHERE id = ?").run(articleId);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static getAllComments(articleId) {
    try {
      const rows = db.prepare("SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC").all(articleId);
      return Promise.resolve(rows);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default Article;
