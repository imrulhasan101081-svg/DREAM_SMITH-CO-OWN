import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ProgressUpdate from "@/lib/models/ProgressUpdate";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("project.progress.update");
    await dbConnect();

    const body = await req.json();
    const { phase, date, description, photos } = body;

    if (!phase || !date || !description) {
      return NextResponse.json(
        { error: "Phase, date, and description are required." },
        { status: 400 }
      );
    }

    const update = await ProgressUpdate.create({
      project_id: params.id,
      phase,
      date: new Date(date),
      description,
      photos: photos || [],
      posted_by: admin.name,
    });

    await logAction({
      admin,
      action: "project.progress.update",
      resourceType: "Project",
      resourceId: params.id,
      resourceLabel: phase,
      newValue: { phase, date: update.date, description },
      description: `Posted progress update (${phase}) for project ${params.id}`,
      req,
    });

    return NextResponse.json({ success: true, update });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
