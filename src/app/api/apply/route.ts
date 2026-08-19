import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/Application";
import Project from "@/lib/models/Project";

// Simple in-memory rate limiter for a single Node process
const ipRequests = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 3; // Max 3 applications
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
    // Basic IP extraction (Note: In Vercel, this is usually req.headers.get('x-forwarded-for'))
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many applications submitted from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const data = await req.json();
    await dbConnect();
    
    // Find the default project (Chihno) since the public form currently hardcodes it
    const project = await Project.findOne({ slug: "chihno" });
    if (!project) {
       return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const application = new Application({
      project_id: project._id,
      full_name: data.name,
      email: data.email,
      contact: data.phone,
      address: data.address || "To be provided",
      nid_number: data.nid,
      shares_requested: data.shares,
      nominee_name: data.nominee_name || "To be provided",
      nominee_relation: data.nominee_relation || "To be provided",
      nominee_contact: data.nominee_contact || "To be provided",
      bank_details: "To be provided",
      status: "new"
    });

    await application.save();

    return NextResponse.json({ success: true, applicationId: application._id });
  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Server error during submission" }, { status: 500 });
  }
}
