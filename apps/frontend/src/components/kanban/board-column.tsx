import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Ticket } from "@/hooks/use-tickets";
import { TicketCard } from "./ticket-card";

interface BoardColumnProps {
    title: string;
    status: string;
    tickets: Ticket[];
}

export function BoardColumn({ title, status, tickets }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div className="flex flex-col w-72 min-h-[500px]">
            <div className="mb-4 px-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600">
                    {title} <span className="ml-1 text-muted-foreground font-normal">({tickets.length})</span>
                </h3>
            </div>

            <div ref={setNodeRef} className="flex-1 rounded-2xl bg-white/20 p-2 border border-white/10">
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}