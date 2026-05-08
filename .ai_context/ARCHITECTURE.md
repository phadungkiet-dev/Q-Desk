# Technical Stack

- Frontend: Next.js 14+ (App Router), Zustand, TanStack Query, Tailwind, Shadcn.
- Backend: Node.js Express (Service Layer Pattern).
- Database: PostgreSQL with Prisma ORM.
- Auth: JWT (Access Token) + HttpOnly Cookie (Refresh Token).

## Database Schema (Prisma)

- **Users**: เก็บข้อมูลผู้ใช้งาน (UUID, Email, Password, Role: ADMIN/USER)
- **Invitations**: ระบบ Invite-only (Token, Email, Is_used, Expires_at)
- **Tickets**: ข้อมูล Kanban (Status: BACKLOG/TODO/IN_PROGRESS/DONE, Priority, Order)
- **Labels**: ออกแบบให้เป็น Independent Master Data ที่ Ticket สามารถดึงไปใช้ได้ผ่าน Join Table (Implicit Many-to-Many)
- **Comments**: ผูกความสัมพันธ์แบบเข้มงวดกับทั้ง User (ผู้เขียน) และ Ticket (ต้นทาง)

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
- **Service Layer Expansion**:
  - `ticket.service.ts` รองรับการ Update แบบ Nested โดยใช้ `labelIds`
  - `comment.service.ts` มีการใช้ `include` เพื่อดึงข้อมูล Profile ของผู้เขียนกลับไปให้ Frontend แสดงผลทันทีโดยไม่ต้องยิง API เพิ่ม

## Frontend Architecture

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn UI (Nova Preset)
- **API Client**: Axios instance พร้อมจัดการ Base URL และ Credentials
- **State Management**:
  - Zustand: เก็บสถานะ Auth และ UI Global State
  - TanStack Query: จัดการ Data Fetching, Caching และ Synchronization กับ Backend API
- **Design System**: Modern Minimalist เน้นสี Pastel และเอฟเฟกต์ Glassmorphism
