import prisma from "../config/database";
import { TicketStatus, TicketPriority } from "../generated/prisma/enums";

export const getAllTickets = async () => {
  // ดึง Ticket ทั้งหมดพร้อมข้อมูลผู้ที่เกี่ยวข้อง
  return await prisma.ticket.findMany({
    include: {
      creator: { select: { id: true, full_name: true, email: true } },
      assignee: { select: { id: true, full_name: true, email: true } },
      labels: true,
    },
    orderBy: { order: "asc" }, // เรียงตามลำดับที่จัดไว้
  });
};

export const createTicket = async (data: {
  title: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  creatorId: string;
  assigneeId?: string;
}) => {
  // คำนวณหาค่า order ล่าสุดในสถานะนั้นๆ เพื่อเอาไปต่อท้าย
  const lastTicket = await prisma.ticket.findFirst({
    where: { status: data.status || "BACKLOG" },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastTicket ? lastTicket.order + 1 : 0;

  return await prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      order: nextOrder,
      creator_id: data.creatorId,
      assignee_id: data.assigneeId,
    },
  });
};

export const updateTicket = async (id: string, data: any) => {
  return await prisma.ticket.update({
    where: { id },
    data,
  });
};

export const deleteTicket = async (id: string) => {
  return await prisma.ticket.delete({
    where: { id },
  });
};
