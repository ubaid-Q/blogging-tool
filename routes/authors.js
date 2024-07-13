import express from "express";
import AuthorController from "../controllers/authorController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.get("/", AuthorController.getAuthorHomePage);

router.get("/settings", AuthorController.getAuthorSettingsPage);
router.post("/settings", AuthorController.updateAuthorSettings);

router.get("/articles/:id/edit", AuthorController.getEditArticlePage);
router.put("/articles/:id", AuthorController.updateArticle);

router.delete("/articles/:id", AuthorController.deleteArticle);
router.post("/articles/:id/publish", AuthorController.publishArticle);

router.post("/articles/new", AuthorController.createNewArticle);


export default router;
