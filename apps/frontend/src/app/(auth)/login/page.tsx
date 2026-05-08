"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

// กำหนด Schema สำหรับตรวจสอบความถูกต้องของข้อมูล
const loginSchema = z.object({
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            // เรียก API ไปยัง Backend ที่เราเตรียมไว้ใน Phase ก่อนหน้า
            const response = await api.post("/auth/login", data);

            if (response.data.success) {
                // เก็บข้อมูล User และ Access Token ลงใน Zustand Store
                const { user, accessToken } = response.data.data;
                setAuth(user, accessToken);

                // เมื่อสำเร็จ ให้ไปที่หน้า Dashboard
                router.push("/dashboard");
            }
        } catch (error: any) {
            console.error("Login failed:", error.response?.data?.message || "Something went wrong");
            // ในขั้นตอนถัดไป เราสามารถเพิ่ม Toast เพื่อแจ้งเตือน User ได้
        }
    };

    return (
        // ใช้ utility "glass" จาก globals.css เพื่อทำเอฟเฟกต์ Glassmorphism
        <Card className="glass border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center font-bold">Q-Desk Login</CardTitle>
                <CardDescription className="text-center">
                    เข้าสู่ระบบเพื่อจัดการ Ticket ของคุณ
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white/50 border-white/20"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            className="bg-white/50 border-white/20"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        ยังไม่มีบัญชี?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            ลงทะเบียนผ่านคำเชิญ
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}