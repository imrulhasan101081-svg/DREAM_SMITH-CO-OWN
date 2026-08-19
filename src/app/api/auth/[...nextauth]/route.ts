import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

import { NextResponse } from "next/server";

// Simple in-memory rate limiter for a single Node process
const ipLoginRequests = new Map<string, { count: number; expiresAt: number }>();
const MAX_LOGIN_ATTEMPTS = 5; // Max 5 login attempts
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

function checkAuthRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipLoginRequests.get(ip);
  
  if (!record || record.expiresAt < now) {
    ipLoginRequests.set(ip, { count: 1, expiresAt: now + LOCKOUT_MS });
    return true;
  }
  
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  return true;
}

const handler = NextAuth(authOptions);

export async function POST(req: Request, ctx: any) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkAuthRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Account temporarily locked for 15 minutes." },
      { status: 429 }
    );
  }
  
  return handler(req, ctx);
}

export { handler as GET };
