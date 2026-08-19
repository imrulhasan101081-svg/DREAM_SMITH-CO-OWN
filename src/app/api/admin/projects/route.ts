import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/admin/projects — list all projects
export async function GET() {
  try {
    await requirePermission("project.update");
    await dbConnect();

    const projects = await Project.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ projects });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// POST /api/admin/projects — create new project
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("project.create");
    await dbConnect();

    const body = await req.json();
    const {
      name, slug, location, address, structure_details, description,
      total_shares, price_per_share, buyback_amount, term_months,
      construction_months, first_refusal_rate, status,
      amenities, facilities, land_area, total_units, total_floors,
      start_date, expected_completion_date,
    } = body;

    if (!name || !slug || !location || !total_shares || !price_per_share) {
      return NextResponse.json(
        { error: "Name, slug, location, total_shares, and price_per_share are required" },
        { status: 400 }
      );
    }

    const existing = await Project.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    const project = await Project.create({
      name, slug, location, address,
      structure_details: structure_details ?? "",
      description,
      total_shares,
      shares_reserved: 0,
      price_per_share,
      buyback_amount: buyback_amount ?? price_per_share,
      term_months: term_months ?? 36,
      construction_months: construction_months ?? 30,
      first_refusal_rate: first_refusal_rate ?? price_per_share,
      status: status ?? "planning",
      isPublished: false,
      isFeatured: false,
      amenities: amenities ?? [],
      facilities: facilities ?? [],
      land_area,
      total_units,
      total_floors,
      start_date: start_date ? new Date(start_date) : undefined,
      expected_completion_date: expected_completion_date ? new Date(expected_completion_date) : undefined,
      constructionProgress: 0,
      progressBreakdown: { foundation: 0, structural: 0, interior: 0, exterior: 0, utility: 0, handover: 0 },
      gallery: [],
      floorPlans: [],
      videoUrls: [],
      visibility: { financials: "public", documents: "client", progress: "public", contacts: "client" },
      createdBy: admin.adminId,
    });

    await logAction({
      admin,
      action: "project.create",
      resourceType: "Project",
      resourceId: project._id.toString(),
      resourceLabel: name,
      description: `Created project: ${name}`,
      req,
    });

    return NextResponse.json({ success: true, project });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
