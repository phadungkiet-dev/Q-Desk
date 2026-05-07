import prisma from "../src/config/database";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 เริ่มต้นการ Seed ข้อมูล...");

  // 1. กำหนดข้อมูล Admin คนแรก
  const adminEmail = "admin@qdesk.com";
  const adminPassword = "Password123!"; // ในโปรเจคจริงควรเปลี่ยนทันทีหลังเข้าใช้งานครั้งแรก

  // 2. ทำการ Hash รหัสผ่าน
  // การใช้ salt rounds = 10 เป็นค่ามาตรฐานที่ปลอดภัยและประสิทธิภาพดี
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 3. ใช้ upsert เพื่อป้องกันการสร้างข้อมูลซ้ำ
  // ถ้ามี email นี้อยู่แล้วจะไม่ทำอะไร (update: {}) แต่ถ้าไม่มีจะสร้างใหม่ (create)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      full_name: "System Administrator",
      role: "ADMIN",
    },
  });

  console.log(`✅ สร้าง Admin เรียบร้อย: ${admin.email}`);
  console.log("🚀 Seed ข้อมูลเสร็จสิ้น!");
}

main()
  .catch((e) => {
    console.error("❌ เกิดข้อผิดพลาดในการ Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // ปิดการเชื่อมต่อ Database เมื่อทำงานเสร็จ
    await prisma.$disconnect();
  });
