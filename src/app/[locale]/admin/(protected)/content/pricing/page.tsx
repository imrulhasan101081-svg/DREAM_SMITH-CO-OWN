import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import PricingPlan from "@/lib/models/PricingPlan";
import PricingManager from "./PricingManager";

export const dynamic = "force-dynamic";

export default async function PricingPlansPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canUpdate = isSuperAdmin || permissions.includes("content.update");

  if (!canUpdate) redirect("/admin/unauthorized");

  await dbConnect();
  
  const plans = await PricingPlan.find({ deletedAt: null }).sort({ order: 1 }).lean();

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Pricing Plans</h1>
          <p className="text-[14px] text-ink/60">Manage the investment tiers displayed on the public website.</p>
        </div>
      </div>

      <div className="card-elevated p-8">
        <PricingManager initialPlans={JSON.parse(JSON.stringify(plans))} />
      </div>
    </div>
  );
}
