import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PricingPlan from "@/lib/models/PricingPlan";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/admin/pricing — list all pricing plans
export async function GET() {
  try {
    await requirePermission("pricing.create");
    await dbConnect();

    const plans = await PricingPlan.find({ deletedAt: null })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ plans });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// POST /api/admin/pricing — create a new pricing plan
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("pricing.create");
    await dbConnect();

    const body = await req.json();
    const { name, description, price, shares, features, isActive, isFeatured, order, badgeText } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: "Name, description, and price are required" },
        { status: 400 }
      );
    }

    const plan = await PricingPlan.create({
      name,
      description,
      price,
      shares: shares ?? 1,
      features: features ?? [],
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      order: order ?? 0,
      badgeText,
      createdBy: admin.adminId,
    });

    await logAction({
      admin,
      action: "pricing.create",
      resourceType: "PricingPlan",
      resourceId: plan._id.toString(),
      resourceLabel: name,
      description: `Created pricing plan: ${name} at ৳${price}`,
      req,
    });

    return NextResponse.json({ success: true, plan });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
