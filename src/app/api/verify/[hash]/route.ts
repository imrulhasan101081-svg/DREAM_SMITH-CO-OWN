import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import Holding from "@/lib/models/Holding";
import Project from "@/lib/models/Project";
import Investor from "@/lib/models/Investor";

// Simple in-memory rate limiter for a single Node process — this is a
// public, unauthenticated endpoint that returns investor PII, so it needs
// to be brute-force resistant against certificate_id enumeration.
const ipRequests = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

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

function maskName(name?: string): string {
  if (!name) return "Registered Investor";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length > 2 ? `${parts[0][0]}***` : parts[0];
  }
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p[0].toUpperCase() + ".").join(" ");
  return `${initials} ${lastName}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    await dbConnect();

    // The hash could be either certificate_id OR qr_verification_hash
    const certificate = await Certificate.findOne({
      $or: [
        { qr_verification_hash: params.hash },
        { certificate_id: params.hash }
      ]
    }).lean();

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const holding = await Holding.findById(certificate.holding_id).lean();
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    const project = await Project.findById(holding.project_id).lean();
    const investor = await Investor.findById(holding.investor_id).lean();

    return NextResponse.json({ 
      success: true, 
      data: {
        certificate_id: certificate.certificate_id,
        status: holding.status,
        investor_name: maskName(investor?.name),
        project_name: project?.name || 'Unknown',
        share_count: holding.share_count,
        maturity_date: holding.maturity_date,
        buyback: holding.share_count * (project?.buyback_amount || 0)
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
