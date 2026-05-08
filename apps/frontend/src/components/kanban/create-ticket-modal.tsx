"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreateTicket, CreateTicketInput } from "@/hooks/use-tickets";
import { useLabels } from "@/hooks/use-labels";

const ticketSchema = z.object({
    title: z.string().min(1, "กรุณากรอกหัวข้อ Ticket"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
    const createTicket = useCreateTicket();
    const { data: labels } = useLabels();

    // สร้าง State สำหรับเก็บ ID ของ Label ที่ถูกเลือก
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateTicketInput>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            priority: "MEDIUM",
        },
    });

    // ฟังก์ชันสำหรับเลือก/ยกเลิก Label
    const toggleLabel = (labelId: string) => {
        setSelectedLabelIds((prev) =>
            prev.includes(labelId)
                ? prev.filter((id) => id !== labelId)
                : [...prev, labelId]
        );
    };

    const onSubmit = async (data: CreateTicketInput) => {
        try {
            // ส่งข้อมูลพร้อมกับ labelIds ที่เลือก
            await createTicket.mutateAsync({
                ...data,
                labelIds: selectedLabelIds
            });
            reset();
            setSelectedLabelIds([]);
            onClose();
        } catch (error) {
            console.error("Failed to create ticket");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-none sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">สร้าง Ticket ใหม่</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    {/* หัวข้อ */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">หัวข้อ</Label>
                        <Input
                            id="title"
                            className="bg-white/50 border-white/20"
                            {...register("title")}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    {/* รายละเอียด */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">รายละเอียด</Label>
                        <Textarea
                            id="description"
                            className="bg-white/50 border-white/20"
                            {...register("description")}
                        />
                    </div>

                    {/* ความสำคัญ */}
                    <div className="grid gap-2">
                        <Label>ความสำคัญ (Priority)</Label>
                        <Select
                            onValueChange={(value: any) => setValue("priority", value)}
                            defaultValue="MEDIUM"
                        >
                            <SelectTrigger className="bg-white/50 border-white/20">
                                <SelectValue placeholder="เลือกความสำคัญ" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ระบบเลือก Label (Multi-select UI) */}
                    <div className="grid gap-2">
                        <Label>ป้ายกำกับ (Labels)</Label>
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/20 border border-white/10">
                            {labels?.map((label) => {
                                const isSelected = selectedLabelIds.includes(label.id);
                                return (
                                    <Badge
                                        key={label.id}
                                        variant="outline"
                                        className={cn(
                                            "cursor-pointer transition-all duration-200 border-white/20",
                                            isSelected
                                                ? "bg-primary text-white scale-105 shadow-sm"
                                                : "bg-white/40 text-slate-600 hover:bg-white/60"
                                        )}
                                        onClick={() => toggleLabel(label.id)}
                                    >
                                        {label.name}
                                    </Badge>
                                );
                            })}
                            {(!labels || labels.length === 0) && (
                                <p className="text-[10px] text-muted-foreground italic">ไม่มีข้อมูล Label</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">ยกเลิก</Button>
                        <Button type="submit" disabled={createTicket.isPending} className="rounded-xl shadow-lg">
                            {createTicket.isPending ? "กำลังบันทึก..." : "สร้าง Ticket"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}