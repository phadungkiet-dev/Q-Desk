# Technical Stack

- Frontend: Next.js 14+ (App Router), Zustand, TanStack Query, Tailwind, Shadcn.
- Backend: Node.js Express (Service Layer Pattern).
- Database: PostgreSQL with Prisma ORM.
- Auth: JWT (Access Token) + HttpOnly Cookie (Refresh Token).

## Database Schema (Prisma)

- **Users**: เก็บข้อมูลผู้ใช้งาน (UUID, Email, Password, Role: ADMIN/USER)
- **Invitations**: ระบบ Invite-only (Token, Email, Is_used, Expires_at)
- **Tickets**: ข้อมูล Kanban (Status: BACKLOG/TODO/IN_PROGRESS/DONE, Priority, Order)
- **Labels**: ป้ายกำกับ (Name, Color) แบบ Many-to-Many กับ Tickets
- **Comments**: ระบบสนทนาใน Ticket แบบ One-to-Many

## Implementation Details

- **Database Singleton**: ใช้ Prisma Client ผ่าน `src/config/database.ts`
- **Security**:
  - Password Hashing: `bcrypt` (Salt Rounds: 10)
  - Auth: `jsonwebtoken`
  - Cookie Handling: `cookie-parser`
- **Database Transaction**: นำมาใช้ในระบบ Registration เพื่อรักษา Data Integrity ระหว่างตาราง User และ Invitation
- **Ticket Management**:
  - ออกแบบ Service Layer ให้รองรับการคำนวณ `order` อัตโนมัติเมื่อมีการสร้าง Ticket ใหม่
  - ใช้ `PATCH` method สำหรับการอัปเดตข้อมูลบางส่วน (Partial Update) เช่น การย้ายสถานะหรือเปลี่ยนลำดับ
