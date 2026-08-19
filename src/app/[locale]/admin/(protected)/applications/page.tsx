import dbConnect from '@/lib/db';
import Application from '@/lib/models/Application';
import Project from '@/lib/models/Project';
import ApplicationActions from './ApplicationActions';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  // "verification.manage" was never one of the real permission constants in
  // ALL_PERMISSIONS (src/lib/models/AdminUser.ts), so it could never
  // actually be granted to a Regular Admin — this page was Super-Admin-only
  // in practice. Gate on the real permissions that cover reviewing and
  // converting applications instead.
  const canVerify =
    isSuperAdmin ||
    permissions.includes("client.document.review") ||
    permissions.includes("certificate.issue");

  if (!canVerify) redirect("/admin/unauthorized");

  await dbConnect();
  
  // Ensure Project model is loaded for populate
  Project.findOne(); 

  const applications = await Application.find({})
    .populate('project_id', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Verification Queue</h1>
          <p className="text-[14px] text-ink/60">Review applications and physical documents before converting to holdings.</p>
        </div>
      </div>
      
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Applicant</th>
              <th className="p-4">Project</th>
              <th className="p-4">Shares</th>
              <th className="p-4">Docs Status</th>
              <th className="p-4">State</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {applications.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-ink/50">No applications found.</td>
              </tr>
            )}
            {applications.map((app: any) => (
              <tr key={app._id.toString()} className="border-t border-line-light hover:bg-ivory/50 transition-colors">
                <td className="p-4 text-ink/70 text-[13px]">
                  {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <div className="font-medium text-navy">{app.full_name}</div>
                  <div className="text-[12px] text-ink/50">{app.contact}</div>
                </td>
                <td className="p-4 text-ink/80 text-[13px]">{app.project_id?.name || 'Unknown'}</td>
                <td className="p-4 font-mono text-[13px] tabular-nums">{app.shares_requested}</td>
                <td className="p-4">
                  {app.verificationStatus === 'pending' && <span className="text-gold-bright text-[12px] font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold-bright"></span> Pending</span>}
                  {app.verificationStatus === 'verified' && <span className="text-sage text-[12px] font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sage"></span> Verified</span>}
                  {app.verificationStatus === 'rejected' && <span className="text-red-500 text-[12px] font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rejected</span>}
                </td>
                <td className="p-4">
                  {app.status === 'new' && <span className="badge-gold uppercase">New</span>}
                  {app.status === 'converted' && <span className="badge-sage uppercase">Converted</span>}
                </td>
                <td className="p-4 text-right">
                  <ApplicationActions 
                    applicationId={app._id.toString()} 
                    status={app.status} 
                    applicantName={app.full_name}
                    sharesRequested={app.shares_requested}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
