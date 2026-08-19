import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AuditLog from "@/lib/models/AuditLog";
import { requireSuperAdmin, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/admin/audit — paginated audit log (Super Admin only)
export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
    const action = searchParams.get("action");
    const adminId = searchParams.get("adminId");
    const resourceType = searchParams.get("resourceType");
    const from = searchParams.get("from"); // ISO date
    const to = searchParams.get("to");

    // Build filter
    const filter: Record<string, unknown> = {};
    if (action) filter.action = action;
    if (adminId) filter.adminId = adminId;
    if (resourceType) filter.resourceType = resourceType;
    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as Record<string, Date>).$gte = new Date(from);
      if (to) (filter.createdAt as Record<string, Date>).$lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
