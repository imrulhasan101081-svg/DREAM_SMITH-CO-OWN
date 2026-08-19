import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AzoCaresEntry from "@/lib/models/AzoCaresEntry";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("cares.create");
    await dbConnect();

    const body = await req.json();
    const { amount, initiative, date, project_id, evidence } = body;

    if (!amount || !initiative || !date || !project_id) {
      return NextResponse.json(
        { error: "Amount, initiative, date, and project_id are required." },
        { status: 400 }
      );
    }

    const entry = await AzoCaresEntry.create({
      amount: Number(amount),
      initiative,
      date: new Date(date),
      project_id,
      evidence: evidence || [],
    });

    await logAction({
      admin,
      action: "cares.create",
      resourceType: "AzoCaresEntry",
      resourceId: entry._id,
      resourceLabel: initiative,
      newValue: { amount: entry.amount, initiative, date: entry.date, project_id },
      description: `Logged Azo Cares entry: ${initiative} (৳${entry.amount})`,
      req,
    });

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
