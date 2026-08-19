import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";
import { requirePermission, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/admin/content — get all site content grouped by section
export async function GET() {
  try {
    await requirePermission("content.update"); // Any admin who can edit content
    await dbConnect();

    const contents = await SiteContent.find({}).sort({ section: 1, key: 1 }).lean();

    // Group by section for easy use in the CMS editor
    const grouped: Record<string, typeof contents> = {};
    for (const item of contents) {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push(item);
    }

    return NextResponse.json({ sections: grouped, flat: contents });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
