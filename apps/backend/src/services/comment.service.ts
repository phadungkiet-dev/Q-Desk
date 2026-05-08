import prisma from "../config/database";

export const createComment = async (data: {
  content: string;
  ticketId: string;
  authorId: string;
}) => {
  return await prisma.comment.create({
    data: {
      content: data.content,
      ticket: { connect: { id: data.ticketId } },
      author: { connect: { id: data.authorId } },
    },
    include: {
      author: { select: { id: true, full_name: true } },
    },
  });
};

export const getCommentsByTicket = async (ticketId: string) => {
  return await prisma.comment.findMany({
    where: { ticket_id: ticketId },
    include: { author: { select: { id: true, full_name: true } } },
    orderBy: { created_at: "desc" },
  });
};
