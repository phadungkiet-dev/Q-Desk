"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Kanban,
    Settings,
    LogOut,
    ChevronRight,
    Menu, // เพิ่ม icon สำหรับเปิด
    X     // เพิ่ม icon สำหรับปิด
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

// เมนูการใช้งานหลักของระบบ
const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Kanban Board", href: "/board", icon: Kanban },
    { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    // 1. สร้าง State สำหรับควบคุมการเปิด/ปิดบน Mobile
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* 2. Mobile Toggle Button - จะแสดงผลเฉพาะจอเล็ก (md:hidden) */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-50 rounded-xl glass md:hidden"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* 3. Mobile Backdrop - พื้นหลังสำหรับกดปิดเมื่อเปิด Sidebar บนมือถือ */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* 4. Sidebar Container - ปรับการแสดงผลแบบ Responsive */}
            <aside className={cn(
                // พื้นฐาน: เป็น Glass style, ความกว้าง 64, มี transition
                "glass flex h-screen w-64 flex-col border-r-0 p-4 transition-all duration-300 z-50",
                // Mobile: ใช้ fixed และเลื่อนเข้า-ออกด้วย translate-x
                "fixed inset-y-0 left-0 transform md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="mb-8 flex items-center gap-3 px-2 pt-12 md:pt-0">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xl">Q</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Q-Desk</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // ปิด Sidebar เมื่อกดเมนู (Mobile)
                            >
                                <div className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/40",
                                    isActive ? "bg-white/60 text-primary shadow-sm" : "text-muted-foreground"
                                )}>
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-primary")} />
                                    {item.title}
                                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-white/20 pt-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
}