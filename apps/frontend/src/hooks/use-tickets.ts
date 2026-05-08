import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  order: number;
  // อ้างอิงตามการใช้ include ใน Prisma ที่ออกแบบไว้
  creator: { fullName: string };
  assignee?: { fullName: string };
  labels: { id: string; name: string; color: string }[];
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  labelIds?: string[];
}

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await api.get("/tickets");
      return response.data.data as Ticket[];
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTicketInput) => {
      const response = await api.post("/tickets", data);
      return response.data;
    },
    onSuccess: () => {
      // ทำให้ข้อมูล tickets เดิมกลายเป็น "stale" เพื่อให้เกิดการ fetch ใหม่
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
