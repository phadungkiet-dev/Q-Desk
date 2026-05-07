import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/response";

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์ตาม Role ที่ระบุ
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. ตรวจสอบว่ามีข้อมูล user จาก auth middleware หรือไม่
    if (!req.user) {
      return sendError(res, "You are not logged in", 401);
    }

    // 2. ตรวจสอบว่า Role ของ user อยู่ในกลุ่มที่อนุญาตหรือไม่
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        "You do not have permission to perform this action",
        403,
      );
    }

    next();
  };
};
