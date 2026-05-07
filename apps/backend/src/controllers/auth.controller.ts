import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.loginService(
      email,
      password,
    );

    // เก็บ Refresh Token ใน HttpOnly Cookie เพื่อความปลอดภัย
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ใช้เฉพาะ HTTPS ใน production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    return sendSuccess(res, { user, accessToken });
  } catch (error: any) {
    return sendError(res, error.message, 401);
  }
};
