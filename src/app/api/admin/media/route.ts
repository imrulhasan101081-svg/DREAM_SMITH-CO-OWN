import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MediaAsset from "@/lib/models/MediaAsset";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/admin/media — list all media assets
export async function GET() {
  try {
    await requirePermission("media.upload");
    await dbConnect();

    const media = await MediaAsset.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ media });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// POST /api/admin/media — create new media asset record (UploadThing usually handles actual upload, this saves to DB)
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("media.upload");
    await dbConnect();

    const body = await req.json();
    const { filename, originalName, mimeType, size, url, storageKey, associatedWith, tags, altText, caption } = body;

    if (!filename || !originalName || !mimeType || !size || !url || !storageKey) {
      return NextResponse.json({ error: "Missing required media fields" }, { status: 400 });
    }

    const media = await MediaAsset.create({
      filename, originalName, mimeType, size, url, storageKey,
      associatedWith, tags: tags ?? [], altText, caption,
      uploadedBy: admin.adminId,
      uploadedByName: admin.name,
    });

    await logAction({
      admin,
      action: "media.upload",
      resourceType: "MediaAsset",
      resourceId: media._id.toString(),
      resourceLabel: originalName,
      description: `Uploaded media: ${originalName}`,
      req,
    });

    return NextResponse.json({ success: true, media });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
