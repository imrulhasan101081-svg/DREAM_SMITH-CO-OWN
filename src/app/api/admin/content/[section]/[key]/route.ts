import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// PATCH /api/admin/content/[section]/[key] — update a single content value
export async function PATCH(
  req: NextRequest,
  { params }: { params: { section: string; key: string } }
) {
  try {
    const admin = await requirePermission("content.update");
    await dbConnect();

    const body = await req.json();
    const { value } = body;

    if (value === undefined || value === null) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    const existing = await SiteContent.findOne({
      section: params.section,
      key: params.key,
    });

    const oldValue = existing?.value;

    const updated = await SiteContent.findOneAndUpdate(
      { section: params.section, key: params.key },
      {
        value: String(value),
        updatedBy: admin.adminId,
        updatedByName: admin.name,
      },
      { returnDocument: 'after', upsert: true }
    );

    await logAction({
      admin,
      action: "content.update",
      resourceType: "SiteContent",
      resourceLabel: `${params.section}.${params.key}`,
      oldValue: { value: oldValue },
      newValue: { value: String(value) },
      description: `Updated site content: ${params.section}.${params.key}`,
      req,
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
