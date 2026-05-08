import { Router } from "express";
import * as labelController from "../controllers/label.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", labelController.getLabels);
router.post("/", labelController.createLabel);
export default router;
