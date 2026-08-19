import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MediaAsset from "@/lib/models/MediaAsset";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// DELETE /api/admin/media/[id] — soft delete a media asset
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("media.delete");
    await dbConnect();

    const media = await MediaAsset.findById(params.id);
    if (!media || media.deletedAt) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    await MediaAsset.findByIdAndUpdate(params.id, {
      deletedAt: new Date(),
    });

    await logAction({
      admin,
      action: "media.delete",
      resourceType: "MediaAsset",
      resourceId: params.id,
      resourceLabel: media.originalName,
      description: `Archived media: ${media.originalName}`,
      req,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
