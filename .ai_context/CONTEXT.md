# Q-Desk Overview

- Purpose: Portfolio-grade Kanban System.
- Core Flow: Admin invites user -> User registers -> Managed tickets on Board.
- Key Styles: Glassmorphism, Pastel, Professional UI.

## Current Status

- [x] Backend Base Setup (Express + TypeScript)
- [x] Database Layer (PostgreSQL + Prisma)
- [x] Authentication Module (Login/JWT, Hashing, Middleware)
- [x] Invitation System (Admin generating invite tokens & RBAC)
- [ ] User Management API (Pending: Registration)

## Technical Decisions

- ใช้ UUID แทน Auto-increment ID เพื่อความปลอดภัยและการ Scalability
- ใช้ Enums ในฐานข้อมูล (UserRole, TicketStatus, TicketPriority) เพื่อป้องกัน Invalid Data
- **Auth Strategy**: ใช้ Dual-token (Access Token + HttpOnly Refresh Token) เพื่อความปลอดภัยสูงสุด
- **Invitation Logic**: Token สุ่มแบบ Cryptographic (Hex) และกำหนดอายุ 48 ชั่วโมง
