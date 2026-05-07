import { Response } from "express";

// ฟังก์ชันสำหรับส่ง Success Response ให้เป็น Format เดียวกันทั้งระบบ
export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

// ฟังก์ชันสำหรับส่ง Error Response
export const sendError = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
