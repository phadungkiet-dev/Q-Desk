import { Request, Response } from "express";
import * as invitationService from "../services/invitation.service";
import { sendSuccess, sendError } from "../utils/response";

export const generateInvite = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, "Email is required", 400);

    const invitation = await invitationService.createInvitation(email);

    return sendSuccess(
      res,
      {
        message: "Invitation generated successfully",
        invitation: {
          email: invitation.email,
          token: invitation.token,
          expires_at: invitation.expires_at,
        },
      },
      201,
    );
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};
