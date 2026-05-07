import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// ทุก Route ของ Ticket ต้องผ่านการ Login ก่อนเสมอ
router.use(authenticate);

router.get("/", ticketController.getTickets);
router.post("/", ticketController.createTicket);
router.patch("/:id", ticketController.updateTicket);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

export default router;
