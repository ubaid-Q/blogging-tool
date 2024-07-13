//readerController.js
import Article from "../models/article.js";
import Comment from "../models/comment.js";
import Settings from "../models/settings.js";

class ReaderController {
  static async getReaderHomePage(req, res) {
    try {
      const settings = await Settings.get();
      const articles = await Article.getAllPublished();
      res.render("reader/home", { articles, settings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getArticlePage(req, res) {
    const articleId = req.params.id;
    try {
      const article = await Article.getById(articleId);
      if (!article) {
        res.status(404).send("Article not found");
        return;
      }
      await Article.incrementViews(articleId);
      const settings = await Settings.get();

      const comments = await Article.getAllComments(articleId);
      res.render("reader/article", { article, comments, settings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async likeArticle(req, res) {
    const articleId = req.params.id;
    try {
      await Article.like(+articleId);
    } catch (err) {
      console.error(err);
    } finally {
      res.redirect(`/articles/${articleId}`);
    }
  }

  static async addComment(req, res) {
    const { commenterName, comment } = req.body;
    const articleId = req.params.id;
    if (!commenterName || !comment) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect(`/articles/${articleId}`);
      return;
    }
    try {
      await Comment.add(articleId, commenterName, comment);
      req.flash("success_msg", "Comment added successfully");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to add comment");
    } finally {
      res.redirect(`/articles/${articleId}`);
    }
  }
}

export default ReaderController;
