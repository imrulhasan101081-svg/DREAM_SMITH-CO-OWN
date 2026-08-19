import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Investor from "@/lib/models/Investor";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("client.document.approve");
    await dbConnect();

    const body = await req.json();
    const { kyc_status } = body;

    if (!kyc_status || !['pending', 'verified'].includes(kyc_status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const investor = await Investor.findByIdAndUpdate(
      params.id,
      { kyc_status },
      { returnDocument: 'after' }
    );

    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    await logAction({
      admin,
      action: "client.document.approve",
      resourceType: "Investor",
      resourceId: params.id,
      resourceLabel: investor.name,
      newValue: { kyc_status },
      description: `Set KYC status to "${kyc_status}" for ${investor.name}`,
      req,
    });

    return NextResponse.json({ success: true, investor });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
