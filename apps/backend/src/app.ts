import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser"; // เพิ่มตัวนี้
import authRoutes from "./routes/auth.routes"; // นำเข้า routes
import invitationRoutes from "./routes/invitation.routes";
import { sendError } from "./utils/response";

const app: Application = express();

// --- Middlewares ---
app.use(helmet()); // ความปลอดภัย HTTP headers
app.use(
  cors({
    origin: "http://localhost:3000", // กำหนดไว้ล่วงหน้าสำหรับ Next.js
    credentials: true, // ยอมรับการส่ง Cookie
  }),
); // อนุญาตการเข้าถึงจาก domain อื่น
app.use(morgan("dev")); // Log request ลง console
app.use(express.json()); // อ่าน body เป็น JSON
app.use(cookieParser()); // ใช้งาน cookie-parser

// --- Routes ---
// ลงทะเบียน API v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/invitations", invitationRoutes);

// --- Health Check Route ---
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Q-Desk API is running" });
});

// --- Centralized Error Handling ---
// ถ้าไม่เจอ route ที่ต้องการ จะส่ง error 404 กลับไป
app.use((req: Request, res: Response) => {
  sendError(res, "Resource not found", 404);
});

export default app;
