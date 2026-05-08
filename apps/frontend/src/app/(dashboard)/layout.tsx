// apps/frontend/src/app/(dashboard)/layout.tsx
import React from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-auth-gradient">
            {/* ส่วน Navigation ด้านข้าง */}
            <Sidebar />

            {/* ส่วนเนื้อหาหลัก */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}