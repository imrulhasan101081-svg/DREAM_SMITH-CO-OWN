import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// PATCH /api/admin/projects/[id]/publish — toggle project publish status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("project.publish");
    await dbConnect();

    const project = await Project.findById(params.id);
    if (!project || project.deletedAt) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const newPublishStatus = body.isPublished ?? !project.isPublished;

    await Project.findByIdAndUpdate(params.id, { isPublished: newPublishStatus });

    await logAction({
      admin,
      action: "project.publish",
      resourceType: "Project",
      resourceId: params.id,
      resourceLabel: project.name,
      oldValue: { isPublished: project.isPublished },
      newValue: { isPublished: newPublishStatus },
      description: `${newPublishStatus ? "Published" : "Unpublished"} project: ${project.name}`,
      req,
    });

    return NextResponse.json({
      success: true,
      isPublished: newPublishStatus,
    });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
