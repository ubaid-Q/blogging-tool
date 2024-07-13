import express from "express";
import ArticleController from "../controllers/articleController.js";

const router = express.Router();

router.get("/", ArticleController.getReaderHomePage);
router.get("/:id", ArticleController.getArticlePage);
router.post("/:id/like", ArticleController.likeArticle);
router.post("/:id/comment", ArticleController.addComment);

export default router;
