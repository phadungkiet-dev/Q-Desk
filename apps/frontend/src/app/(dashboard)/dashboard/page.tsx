"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ข้อมูลจำลองสำหรับตัวอย่าง UI (เดี๋ยวเราจะแทนที่ด้วย TanStack Query ในขั้นตอนถัดไป)
const stats = [
    { title: "Total Tickets", value: "24", icon: Ticket, color: "bg-pastel-blue" },
    { title: "In Progress", value: "8", icon: Clock, color: "bg-pastel-yellow" },
    { title: "Completed", value: "12", icon: CheckCircle2, color: "bg-pastel-green" },
    { title: "Urgent", value: "4", icon: AlertCircle, color: "bg-pastel-pink" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">ยินดีต้อนรับกลับมา! นี่คือภาพรวมงานของคุณในขณะนี้</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="glass border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={cn("p-2 rounded-lg", stat.color)}>
                                <stat.icon className="h-4 w-4 text-slate-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">+2 จากสัปดาห์ที่แล้ว</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ในอนาคตเราจะเพิ่มส่วน Recent Activity หรือ Chart ที่นี่ */}
            <div className="h-[300px] glass rounded-3xl border-none flex items-center justify-center text-muted-foreground italic">
                Recent Activity Chart (Coming Soon)
            </div>
        </div>
    );
}