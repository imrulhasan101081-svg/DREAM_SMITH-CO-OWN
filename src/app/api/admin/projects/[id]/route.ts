import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// PATCH /api/admin/projects/[id] — update project
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("project.update");
    await dbConnect();

    const project = await Project.findById(params.id);
    if (!project || project.deletedAt) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();

    // Capture old values for audit
    const oldValue: Record<string, unknown> = {
      name: project.name,
      status: project.status,
      constructionProgress: project.constructionProgress,
      isPublished: project.isPublished,
    };

    // Update allowed fields
    const allowed = [
      "name", "location", "address", "structure_details", "description",
      "status", "isPublished", "isFeatured",
      "coverImage", "gallery", "floorPlans", "brochureUrl", "videoUrls",
      "amenities", "facilities", "land_area", "total_units", "total_floors",
      "parking_info", "payment_info", "emi_info",
      "expected_completion_date", "start_date",
      "constructionProgress", "progressBreakdown",
      "visibility", "assignedAdminId",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        (project as any)[key] = body[key];
      }
    }

    await project.save();

    await logAction({
      admin,
      action: "project.update",
      resourceType: "Project",
      resourceId: params.id,
      resourceLabel: project.name,
      oldValue,
      newValue: { name: project.name, status: project.status, constructionProgress: project.constructionProgress, isPublished: project.isPublished },
      description: `Updated project: ${project.name}`,
      req,
    });

    return NextResponse.json({ success: true, project });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// DELETE /api/admin/projects/[id] — soft archive
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("project.delete");
    await dbConnect();

    const project = await Project.findById(params.id);
    if (!project || project.deletedAt) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await Project.findByIdAndUpdate(params.id, {
      deletedAt: new Date(),
      isPublished: false,
    });

    await logAction({
      admin,
      action: "project.delete",
      resourceType: "Project",
      resourceId: params.id,
      resourceLabel: project.name,
      description: `Soft-archived project: ${project.name}`,
      req,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
