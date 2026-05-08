"use client";

import React from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTickets, Ticket } from "@/hooks/use-tickets";
import { BoardColumn } from "@/components/kanban/board-column";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { CreateTicketModal } from "@/components/kanban/create-ticket-modal";
import { Plus } from "lucide-react"; // สำหรับไอคอนเครื่องหมายบวก
import { Button } from "@/components/ui/button";

const COLUMNS = [
    { title: "Backlog", status: "BACKLOG" },
    { title: "To Do", status: "TODO" },
    { title: "In Progress", status: "IN_PROGRESS" },
    { title: "Done", status: "DONE" },
];

export default function BoardPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const { data: tickets, isLoading } = useTickets();
    const queryClient = useQueryClient();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // หาตั๋วที่กำลังถูกลาก
        const activeTicket = tickets?.find(t => t.id === activeId);
        if (!activeTicket) return;

        // Logic: ตรวจสอบว่าวางบนคอลัมน์ หรือวางบนตั๋วใบอื่น
        const isOverAColumn = COLUMNS.some(col => col.status === overId);
        let newStatus = activeTicket.status;

        if (isOverAColumn) {
            newStatus = overId as Ticket["status"];
        } else {
            const overTicket = tickets?.find(t => t.id === overId);
            if (overTicket) newStatus = overTicket.status;
        }

        // หากมีการเปลี่ยนสถานะ หรือเปลี่ยนลำดับ
        if (activeTicket.status !== newStatus || activeId !== overId) {
            try {
                // ในขั้นตอนนี้เราจะยิง PATCH API ไปที่ Backend เพื่ออัปเดตสถานะ
                // ตาม ARCHITECTURE.md ที่ออกแบบไว้
                await api.patch(`/tickets/${activeId}`, {
                    status: newStatus,
                    // ในขั้นถัดไปเราจะเพิ่ม Logic การคำนวณ 'order' ที่แม่นยำขึ้น
                });

                // Refresh ข้อมูลเพื่อให้ UI ตรงกับ Database
                queryClient.invalidateQueries({ queryKey: ["tickets"] });
            } catch (error) {
                console.error("Failed to update ticket status");
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground italic">Loading Workspace...</div>;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
                        <p className="text-muted-foreground">จัดการงานของคุณผ่านระบบ Board</p>
                    </div>
                    <Button
                        className="rounded-xl gap-2 shadow-lg"
                        onClick={() => setIsModalOpen(true)} // เปิด Modal
                    >
                        <Plus className="h-4 w-4" /> New Ticket
                    </Button>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-6">
                    {COLUMNS.map((col) => (
                        <BoardColumn
                            key={col.status}
                            title={col.title}
                            status={col.status}
                            tickets={tickets?.filter(t => t.status === col.status).sort((a, b) => a.order - b.order) || []}
                        />
                    ))}
                </div>

                <CreateTicketModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </DndContext>
    );
}