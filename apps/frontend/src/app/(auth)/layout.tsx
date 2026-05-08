// apps/frontend/src/app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ใช้ bg-auth-gradient ที่เราสร้างไว้ใน globals.css เพื่อคุมโทน Pastel
    <main className="bg-auth-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* children จะเป็นหน้า Login หรือ Register */}
        {children}
      </div>
    </main>
  );
}