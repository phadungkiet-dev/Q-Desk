import { Router } from "express";
import * as commentController from "../controllers/comment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.post("/", commentController.addComment);
export default router;
