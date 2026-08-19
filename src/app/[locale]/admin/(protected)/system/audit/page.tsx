import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import AuditLog from "@/lib/models/AuditLog";
import AdminUser from "@/lib/models/AdminUser";

export const dynamic = "force-dynamic";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  await dbConnect();

  // Parsing search params
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const limit = 50;
  const { action, adminId, resourceType } = searchParams;

  const filter: Record<string, unknown> = {};
  if (action) filter.action = action;
  if (adminId) filter.adminId = adminId;
  if (resourceType) filter.resourceType = resourceType;

  const [logs, total, admins] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
    AdminUser.find({}).select("name _id").lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">System Audit Logs</h1>
        <p className="text-[14px] text-ink/60">Immutable record of all administrative actions taken on the platform.</p>
      </div>

      <div className="card-elevated overflow-hidden">
        {/* Simple Filters — would ideally be a client component in a real app, but static HTML here for speed */}
        <div className="bg-ivory/50 p-4 border-b border-line-light flex gap-4 text-[13px]">
          <form className="flex gap-4 items-end w-full" method="GET">
            <div className="flex-1">
              <label className="block text-ink/60 mb-1">Filter by Admin</label>
              <select name="adminId" defaultValue={adminId || ""} className="w-full border border-line-light rounded-sm p-2 bg-white text-navy focus:outline-none focus:border-gold">
                <option value="">All Admins</option>
                {admins.map((a: any) => (
                  <option key={a._id.toString()} value={a._id.toString()}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-ink/60 mb-1">Filter by Resource</label>
              <select name="resourceType" defaultValue={resourceType || ""} className="w-full border border-line-light rounded-sm p-2 bg-white text-navy focus:outline-none focus:border-gold">
                <option value="">All Resources</option>
                <option value="AdminUser">Admin Accounts</option>
                <option value="Project">Projects</option>
                <option value="SiteContent">Site Content</option>
                <option value="PricingPlan">Pricing Plans</option>
                <option value="MediaAsset">Media</option>
              </select>
            </div>
            <button type="submit" className="bg-navy text-ivory px-6 py-2 rounded-sm hover:bg-navy-light font-medium h-[38px]">
              Apply Filters
            </button>
            {(action || adminId || resourceType) && (
              <a href="/admin/system/audit" className="px-4 py-2 border border-line-light rounded-sm text-ink/70 hover:bg-ivory h-[38px] flex items-center">
                Clear
              </a>
            )}
          </form>
        </div>

        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink/50">No logs found matching criteria.</td>
              </tr>
            ) : logs.map((log: any) => (
              <tr key={log._id.toString()} className="border-t border-line-light hover:bg-ivory/50 transition-colors">
                <td className="p-4 text-ink/60 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('en-GB', { 
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </td>
                <td className="p-4">
                  <div className="font-medium text-navy">{log.adminName}</div>
                  <div className="text-[11px] text-ink/40 font-mono">{log.adminRole.replace('_', ' ')}</div>
                </td>
                <td className="p-4 font-mono text-[11px] text-navy/70">
                  {log.action}
                </td>
                <td className="p-4">
                  <div className="font-medium">{log.resourceType}</div>
                  {log.resourceLabel && <div className="text-ink/60 truncate max-w-[150px]" title={log.resourceLabel}>{log.resourceLabel}</div>}
                </td>
                <td className="p-4 text-ink/80 max-w-[300px]">
                  {log.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-line-light flex justify-between items-center bg-ivory/30 text-[13px]">
            <div className="text-ink/60">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
            </div>
            <div className="flex gap-2">
              <a 
                href={page > 1 ? `?page=${page - 1}${adminId ? `&adminId=${adminId}` : ''}${resourceType ? `&resourceType=${resourceType}` : ''}` : '#'} 
                className={`px-3 py-1.5 border rounded-sm ${page > 1 ? 'border-line-light hover:bg-white text-navy' : 'border-line-light/50 text-ink/30 cursor-not-allowed'}`}
              >
                Previous
              </a>
              <a 
                href={page < totalPages ? `?page=${page + 1}${adminId ? `&adminId=${adminId}` : ''}${resourceType ? `&resourceType=${resourceType}` : ''}` : '#'} 
                className={`px-3 py-1.5 border rounded-sm ${page < totalPages ? 'border-line-light hover:bg-white text-navy' : 'border-line-light/50 text-ink/30 cursor-not-allowed'}`}
              >
                Next
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
