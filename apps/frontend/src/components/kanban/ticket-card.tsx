"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ticket } from "@/hooks/use-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // สมมติว่ามี Shadcn Badge
import { cn } from "@/lib/utils";

interface TicketCardProps {
    ticket: Ticket;
}

// กำหนดสี Pastel ตาม Priority
const priorityColors = {
    LOW: "bg-pastel-green text-green-700",
    MEDIUM: "bg-pastel-blue text-blue-700",
    HIGH: "bg-pastel-yellow text-yellow-700",
    URGENT: "bg-pastel-pink text-pink-700",
};

export function TicketCard({ ticket }: TicketCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ticket.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="glass group border-none shadow-sm hover:shadow-md transition-all cursor-pointer mb-3">
                <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start gap-2">
                        <Badge className={cn("text-[10px] px-1.5 py-0 border-none", priorityColors[ticket.priority])}>
                            {ticket.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">#{ticket.order}</span>
                    </div>
                    <CardTitle className="text-sm font-semibold mt-2 line-clamp-2">
                        {ticket.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="flex flex-wrap gap-1 mt-2">
                        {ticket.labels.map((label) => (
                            <span
                                key={label.id}
                                className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/50 border border-white/20"
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                            {ticket.creator.fullName.charAt(0)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}