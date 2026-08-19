import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import AdminUser, { ALL_PERMISSIONS } from "@/lib/models/AdminUser";
import AuditLog from "@/lib/models/AuditLog";
import AdminDetailClient from "./AdminDetailClient";

export const dynamic = "force-dynamic";

export default async function AdminDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  await dbConnect();
  
  const admin = await AdminUser.findById(params.id).select("-password_hash -googleId").lean();
  if (!admin) redirect("/admin/system/admins");

  const recentActivity = await AuditLog.find({ adminId: params.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Manage Admin: {admin.name}</h1>
        <p className="text-[14px] text-ink/60">Update permissions, view activity, or deactivate account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-elevated p-8">
            <h2 className="text-[16px] font-medium text-navy mb-6">Account Settings</h2>
            <AdminDetailClient 
              admin={JSON.parse(JSON.stringify(admin))} 
              availablePermissions={Object.values(ALL_PERMISSIONS)} 
            />
          </div>
        </div>

        <div>
          <div className="card-elevated p-6">
            <h2 className="text-[14px] font-medium text-navy mb-4 border-b border-line-light pb-2">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="text-[13px] text-ink/50 text-center py-4">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((log: any) => (
                  <div key={log._id.toString()} className="text-[12px]">
                    <div className="font-mono text-ink/70 mb-1">{log.action}</div>
                    <div className="text-navy">{log.description}</div>
                    <div className="text-ink/40 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
