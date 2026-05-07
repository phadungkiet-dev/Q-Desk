import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as ticketService from "../services/ticket.service";
import { sendSuccess, sendError } from "../utils/response";

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await ticketService.getAllTickets();
    return sendSuccess(res, tickets);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, priority, assigneeId } = req.body;

    // ดึง userId จาก middleware authenticate
    const creatorId = req.user!.userId;

    const ticket = await ticketService.createTicket({
      title,
      description,
      status,
      priority,
      creatorId,
      assigneeId,
    });

    return sendSuccess(res, ticket, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.updateTicket(id as string, req.body);
    return sendSuccess(res, ticket);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const deleteTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await ticketService.deleteTicket(id as string);
    return sendSuccess(res, { message: "Ticket deleted successfully" });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
