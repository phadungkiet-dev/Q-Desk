"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

const registerSchema = z.object({
    fullName: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    // ตรวจสอบความถูกต้องของ Token ทันทีเมื่อเข้าหน้านี้
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsValidToken(false);
                return;
            }
            try {
                // Backend API สำหรับตรวจสอบ Invitation Token
                await api.get(`/invitations/verify/${token}`);
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
            }
        };
        verifyToken();
    }, [token]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await api.post("/auth/register", {
                token,
                fullName: data.fullName,
                password: data.password,
            });
            router.push("/login?registered=true");
        } catch (error: any) {
            console.error("Registration failed");
        }
    };

    if (isValidToken === false) {
        return (
            <Card className="glass border-none">
                <CardHeader>
                    <CardTitle className="text-destructive text-center">Invalid Token</CardTitle>
                    <CardDescription className="text-center">
                        คำเชิญนี้ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาติดต่อ Admin เพื่อขอคำเชิญใหม่
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="glass border-none shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center font-bold">Create Account</CardTitle>
                <CardDescription className="text-center">ลงทะเบียนเข้าใช้งาน Q-Desk ผ่านคำเชิญ</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" className="bg-white/50 border-white/20" {...register("fullName")} />
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" className="bg-white/50 border-white/20" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" className="bg-white/50 border-white/20" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting || isValidToken === null}>
                        {isSubmitting ? "กำลังบันทึกข้อมูล..." : "สร้างบัญชีผู้ใช้"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}