import bcrypt from "bcrypt";
import prisma from "../config/database";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const loginService = async (email: string, pass: string) => {
  // 1. ค้นหาผู้ใช้จาก Email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  // 2. ตรวจสอบรหัสผ่าน (เปรียบเทียบรหัสที่รับมากับรหัสที่ Hash ใน DB)
  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // 3. สร้าง Payload สำหรับ Token (ไม่เก็บข้อมูลลับในนี้)
  const payload = { userId: user.id, role: user.role };

  // 4. สร้าง Tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
