import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

// Endpoint สำหรับการสมัครสมาชิก: POST /api/v1/users/register
// เส้นทางนี้เป็น Public เนื่องจากผู้ใช้ยังไม่มีสิทธิ์จนกว่าจะสมัครเสร็จ
router.post("/register", userController.register);

export default router;
