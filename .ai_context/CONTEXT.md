# Q-Desk Overview

- Purpose: Portfolio-grade Kanban System.
- Core Flow: Admin invites user -> User registers -> Managed tickets on Board.
- Key Styles: Glassmorphism, Pastel, Professional UI.

## Current Status

- [x] Backend Base Setup (Express + TypeScript)
- [x] Database Layer (PostgreSQL + Prisma)
- [ ] Authentication Module (Pending)

## Technical Decisions

- ใช้ UUID แทน Auto-increment ID เพื่อความปลอดภัยและการ Scalability
- ใช้ Enums ในฐานข้อมูล (UserRole, TicketStatus, TicketPriority) เพื่อป้องกัน Invalid Data
