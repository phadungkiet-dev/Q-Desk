import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

// ขยาย Interface ของ Express Request เพื่อให้เก็บข้อมูล user ได้
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. ดึง Token จาก Header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, "Unauthenticated: No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // 2. ตรวจสอบความถูกต้องของ Token
    const decoded = verifyToken(token) as { userId: string; role: string };

    // 3. แนบข้อมูล user เข้าไปใน request เพื่อให้ controller อื่นๆ ใช้งานต่อได้
    req.user = decoded;

    // 4. ไปต่อยังฟังก์ชันถัดไป
    next();
  } catch (error) {
    return sendError(res, "Unauthenticated: Invalid or expired token", 401);
  }
};
