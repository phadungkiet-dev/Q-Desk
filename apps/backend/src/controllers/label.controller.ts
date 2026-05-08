import { Request, Response } from "express";
import * as labelService from "../services/label.service";
import { sendSuccess, sendError } from "../utils/response";

export const getLabels = async (req: Request, res: Response) => {
  try {
    const labels = await labelService.getAllLabels();
    return sendSuccess(res, labels);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createLabel = async (req: Request, res: Response) => {
  try {
    const label = await labelService.createLabel(req.body);
    return sendSuccess(res, label, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
