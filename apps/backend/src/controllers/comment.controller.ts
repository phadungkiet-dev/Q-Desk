import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as commentService from "../services/comment.service";
import { sendSuccess, sendError } from "../utils/response";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, ticketId } = req.body;
    const authorId = req.user!.userId;

    const comment = await commentService.createComment({
      content,
      ticketId,
      authorId,
    });
    return sendSuccess(res, comment, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
