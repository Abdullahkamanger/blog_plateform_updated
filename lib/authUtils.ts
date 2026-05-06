import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

// 1. Helper to retrieve session
export async function getSessionUser() {
  const session = await auth();
  return session;
}

// 2. Middleware or check for Admin role
export function requireAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

// 3. Middleware or check for Author role (Approved Authors or Admins)
export function requireAuthor(session: Session | null): boolean {
  if (!session || !session.user) return false;

  const { role, status } = session.user as any;
  
  return (role === "AUTHOR" && status === "APPROVED") || role === "ADMIN";
}