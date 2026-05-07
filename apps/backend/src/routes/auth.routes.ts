import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

// Endpoint สำหรับ Login: POST /api/v1/auth/login
router.post("/login", authController.login);

export default router;
