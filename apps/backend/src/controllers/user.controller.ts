import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, token } = req.body;

    // ตรวจสอบความครบถ้วนเบื้องต้น
    if (!email || !password || !fullName || !token) {
      return sendError(res, "All fields are required", 400);
    }

    const user = await userService.registerUser({
      email,
      password,
      fullName,
      token,
    });

    return sendSuccess(
      res,
      {
        message: "User registered successfully",
        user,
      },
      201,
    );
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};
