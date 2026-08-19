import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PricingPlan from "@/lib/models/PricingPlan";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// PATCH /api/admin/pricing/[id] — update a pricing plan
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("pricing.update");
    await dbConnect();

    const plan = await PricingPlan.findById(params.id);
    if (!plan || plan.deletedAt) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const body = await req.json();
    const oldValue = {
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      isFeatured: plan.isFeatured,
    };

    const allowed = [
      "name", "description", "price", "currency", "shares",
      "features", "isActive", "isFeatured", "order", "badgeText",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        (plan as any)[key] = body[key];
      }
    }
    await plan.save();

    await logAction({
      admin,
      action: "pricing.update",
      resourceType: "PricingPlan",
      resourceId: params.id,
      resourceLabel: plan.name,
      oldValue,
      newValue: { name: plan.name, price: plan.price, isActive: plan.isActive },
      description: `Updated pricing plan: ${plan.name}`,
      req,
    });

    return NextResponse.json({ success: true, plan });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// DELETE /api/admin/pricing/[id] — soft archive a pricing plan
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("pricing.delete");
    await dbConnect();

    const plan = await PricingPlan.findById(params.id);
    if (!plan || plan.deletedAt) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    await PricingPlan.findByIdAndUpdate(params.id, {
      deletedAt: new Date(),
      isActive: false,
    });

    await logAction({
      admin,
      action: "pricing.delete",
      resourceType: "PricingPlan",
      resourceId: params.id,
      resourceLabel: plan.name,
      description: `Archived pricing plan: ${plan.name}`,
      req,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
