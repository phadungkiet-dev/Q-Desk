import crypto from "crypto";
import prisma from "../config/database";

export const createInvitation = async (email: string) => {
  // 1. ตรวจสอบว่าอีเมลนี้ถูกใช้งานไปหรือยังในระบบ User
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error("User with this email already exists");

  // 2. ลบ Invitation เดิมของอีเมลนี้ที่ยังไม่ได้ใช้งาน (ถ้ามี) เพื่อเริ่มใหม่
  await prisma.invitation.deleteMany({
    where: { email, is_used: "false" },
  });

  // 3. สร้าง Token สุ่ม 32 ตัวอักษร
  const token = crypto.randomBytes(16).toString("hex");

  // 4. กำหนดวันหมดอายุ (เช่น 48 ชั่วโมงจากตอนนี้)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // 5. บันทึกลง Database
  const invitation = await prisma.invitation.create({
    data: {
      email,
      token,
      expires_at: expiresAt,
    },
  });

  return invitation;
};
