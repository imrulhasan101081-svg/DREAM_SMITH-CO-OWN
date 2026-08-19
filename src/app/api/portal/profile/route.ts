import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Investor from "@/lib/models/Investor";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "investor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    // Only allow updating specific fields
    const updatedInvestor = await Investor.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          contact: data.contact,
          email: data.email,
          nominee_name: data.nominee_name,
          nominee_relation: data.nominee_relation,
          address: data.address
        }
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedInvestor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, investor: updatedInvestor });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
