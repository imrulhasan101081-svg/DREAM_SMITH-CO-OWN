import dbConnect from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  await dbConnect();
  const admins = await AdminUser.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Admin Accounts</h1>
          <p className="text-[14px] text-ink/60">Manage platform administrators and their permissions.</p>
        </div>
        <Link href="/admin/system/admins/new" className="bg-navy text-ivory px-6 py-2.5 rounded-sm hover:bg-navy-light transition-colors text-[14px] font-medium">
          + Add New Admin
        </Link>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">Name & Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {admins.map((admin: any) => (
              <tr key={admin._id.toString()} className="border-t border-line-light hover:bg-ivory/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-navy">{admin.name}</div>
                  <div className="text-[12px] text-ink/50">{admin.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[11px] font-mono rounded-sm uppercase tracking-wider ${
                    admin.role === "SUPER_ADMIN" ? "bg-gold/20 text-gold-bright" : "bg-sage/20 text-sage"
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  {admin.isActive ? (
                    <span className="text-sage flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-sage"></span> Active</span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Deactivated</span>
                  )}
                </td>
                <td className="p-4 text-ink/60 text-[13px]">
                  {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/system/admins/${admin._id.toString()}`} className="text-gold-bright hover:underline text-[13px] font-medium">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
