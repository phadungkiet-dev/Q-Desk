# Q-Desk Overview

- Purpose: Portfolio-grade Kanban System.
- Core Flow: Admin invites user -> User registers -> Managed tickets on Board.
- Key Styles: Glassmorphism, Pastel, Professional UI.

## Current Status

- [x] Backend Base Setup (Express + TypeScript)
- [x] Database Layer (PostgreSQL + Prisma)
- [x] Authentication Module (Login/JWT, Hashing, Middleware)
- [x] Invitation System (Admin generating invite tokens & RBAC)
- [x] User Management API (Pending: Registration)
- [x] Ticket API (CRUD & Board Logic with Ordering)
- [x] Labels & Comments API (Many-to-Many & Relationship logic)
- [ ] Frontend Project Setup (Next Step)

## Technical Decisions

- ใช้ UUID แทน Auto-increment ID เพื่อความปลอดภัยและการ Scalability
- ใช้ Enums ในฐานข้อมูล (UserRole, TicketStatus, TicketPriority) เพื่อป้องกัน Invalid Data
- **Auth Strategy**: ใช้ Dual-token (Access Token + HttpOnly Refresh Token) เพื่อความปลอดภัยสูงสุด
- **Invitation Logic**: Token สุ่มแบบ Cryptographic (Hex) และกำหนดอายุ 48 ชั่วโมง
- **Registration Flow**: ใช้ Prisma Transaction (`$transaction`) เพื่อให้มั่นใจว่าการสร้าง User และการปิดการใช้งาน Token (Invitation) ต้องสำเร็จพร้อมกันเท่านั้น
- **Kanban Ordering**: ใช้ฟิลด์ `order` แบบ Integer ในการเก็บลำดับของ Ticket ภายในแต่ละ Status เพื่อให้ Frontend สามารถแสดงผลตามลำดับที่ผู้ใช้จัดวางได้
- **Data Fetching**: ใช้ Eager Loading ผ่าน Prisma `include` เพื่อดึงข้อมูล Creator และ Assignee มาพร้อมกับ Ticket ในครั้งเดียว ลดปัญหา N+1 Query
- **Many-to-Many Management**: การจัดการ Labels ใน Ticket ใช้กลไก `set` ของ Prisma เพื่อทำการล้างและอัปเดตความสัมพันธ์ใหม่ทั้งหมดในคำสั่งเดียว ช่วยให้ Logic ที่ Frontend ง่ายขึ้น
- **Data Integrity**: ตั้งค่า `onDelete: Cascade` สำหรับ Comments เพื่อให้เมื่อ Ticket ถูกลบ ข้อมูลคอมเมนต์จะถูกทำความสะอาดโดยอัตโนมัติจาก Database
