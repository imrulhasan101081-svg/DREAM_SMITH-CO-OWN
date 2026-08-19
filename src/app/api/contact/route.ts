import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";

// Simple in-memory rate limiter for a single Node process
const ipRequests = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || record.expiresAt < now) {
    ipRequests.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many messages submitted from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const data = await req.json();

    if (
      typeof data.name !== "string" || !data.name.trim() ||
      typeof data.email !== "string" || !data.email.trim() ||
      typeof data.message !== "string" || !data.message.trim()
    ) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await dbConnect();

    const contactMessage = new ContactMessage({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: typeof data.phone === "string" ? data.phone.trim() : undefined,
      message: data.message.trim(),
    });

    await contactMessage.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Server error during submission" }, { status: 500 });
  }
}
