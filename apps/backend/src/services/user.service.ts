import bcrypt from "bcrypt";
import prisma from "../config/database";

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  token: string;
}

export const registerUser = async (data: RegisterData) => {
  const { email, password, fullName, token } = data;

  // 1. ค้นหา Invitation จาก Token
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  // 2. ตรวจสอบเงื่อนไขความถูกต้องของ Invitation
  if (!invitation) throw new Error("Invalid invitation token");
  if (invitation.is_used === "true")
    throw new Error("Invitation token already used");
  if (invitation.email !== email)
    throw new Error("Email does not match the invitation");

  const now = new Date();
  if (invitation.expires_at < now)
    throw new Error("Invitation token has expired");

  // 3. ตรวจสอบว่า Email นี้มีอยู่ในระบบหรือยัง (Double Check)
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  // 4. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. ดำเนินการสร้าง User และอัปเดต Invitation (Database Transaction)
  // ใช้ $transaction เพื่อให้มั่นใจว่าทั้งสองคำสั่งต้องสำเร็จพร้อมกัน
  const result = await prisma.$transaction(async (tx) => {
    // สร้าง User ใหม่
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name: fullName,
        role: "USER", // เริ่มต้นเป็น USER เสมอ
      },
    });

    // อัปเดต Invitation เป็นใช้แล้ว
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { is_used: "true" },
    });

    return newUser;
  });

  return {
    id: result.id,
    email: result.email,
    fullName: result.full_name,
  };
};
