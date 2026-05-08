import prisma from "../config/database";

export const getAllLabels = async () => {
  return await prisma.label.findMany();
};

export const createLabel = async (data: { name: string; color: string }) => {
  return await prisma.label.create({ data });
};

export const deleteLabel = async (id: string) => {
  return await prisma.label.delete({ where: { id } });
};
