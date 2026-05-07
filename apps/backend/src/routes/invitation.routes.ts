import { Router } from "express";
import * as invitationController from "../controllers/invitation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/role.middleware";

const router = Router();

// เฉพาะ ADMIN ที่ Login แล้วเท่านั้นที่สร้างคำเชิญได้
router.post(
  "/",
  authenticate,
  restrictTo("ADMIN"),
  invitationController.generateInvite,
);

export default router;
