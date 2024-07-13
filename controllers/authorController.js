//authorController.js
import Author from "../models/author.js";
import Article from "../models/article.js";

class AuthorController {
  static async getAuthorHomePage(req, res) {
    try {
      const author = await Author.getAuthorById(req.user.id); // Fetch author data
      if (!author) {
        return res.status(404).send("Author not found");
      }

      // Fetch all articles (both published and draft) for the author
      const [publishedArticles, draftArticles] = await Promise.all([Article.getAllPublished(req.user.id), Article.getAllDraft(req.user.id)]);

      res.render("author/home", { author, publishedArticles, draftArticles }); // Pass data to the view
    } catch (err) {
      console.error("Error fetching author home page data:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async createNewArticle(req, res) {
    try {
      // Create new article draft in database
      const newArticle = await Article.create(req.user.id);
      res.redirect(`/authors/articles/${newArticle.id}/edit`); // Redirect to edit page of the new article
    } catch (err) {
      console.error("Error creating new article:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getAuthorSettingsPage(req, res) {
    try {
      const author = await Author.getAuthorById(req.user.id);
      res.render("author/settings", { author });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async updateAuthorSettings(req, res) {
    const { blogTitle, authorName } = req.body;
    if (!blogTitle || !authorName) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/authors/settings");
      return;
    }
    try {
      await Author.updateAuthorSettings(req.user.id, blogTitle, authorName);
      req.flash("success_msg", "Settings updated successfully");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to update settings");
    } finally {
      res.redirect("/authors/settings");
    }
  }

  static async getEditArticlePage(req, res) {
    const articleId = req.params.id;
    try {
      const author = await Author.getAuthorById(req.user.id);
      const article = await Article.getById(articleId);
      res.render("author/edit_article", { article, author });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async updateArticle(req, res) {
    const { title, content } = req.body;
    const articleId = req.params.id;
    if (!title || !content) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect(`/authors/articles/${articleId}/edit`);
      return;
    }
    try {
      await Article.update(articleId, title, content);
      req.flash("success_msg", "Article updated successfully");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to update article");
    } finally {
      res.redirect("/authors");
    }
  }

  static async deleteArticle(req, res) {
    const articleId = req.params.id;
    try {
      await Article.delete(articleId);
      req.flash("success_msg", "Article deleted successfully");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to delete article");
    } finally {
      res.redirect("/authors");
    }
  }

  static async publishArticle(req, res) {
    const articleId = req.params.id;
    try {
      await Article.publish(articleId);
      req.flash("success_msg", "Article published successfully");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to publish article");
    } finally {
      res.redirect("/authors");
    }
  }
}

export default AuthorController;
