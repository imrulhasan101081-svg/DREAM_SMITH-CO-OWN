import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from '@/lib/db';
import Investor from '@/lib/models/Investor';
import { decrypt } from '@/lib/encryption';
import KycToggle from './KycToggle';

export default async function AdminInvestorsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canView = isSuperAdmin || permissions.includes("client.document.review");

  if (!canView) redirect("/admin/unauthorized");

  await dbConnect();

  const investors = await Investor.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Investor Management</h1>
          <p className="text-[14px] text-ink/60">View all investors and verify their KYC status.</p>
        </div>
      </div>
      
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Contact & Email</th>
              <th className="p-4">NID / Passport</th>
              <th className="p-4">KYC Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {investors.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink/50">No investors found. Convert an application to create one.</td>
              </tr>
            )}
            {investors.map((inv: any) => (
              <tr key={inv._id.toString()} className="border-t border-line-light hover:bg-ivory/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-navy">{inv.name}</div>
                  <div className="text-[12px] text-ink/50">Joined {new Date(inv.createdAt).getFullYear()}</div>
                </td>
                <td className="p-4">
                  <div className="text-navy">{inv.contact}</div>
                  <div className="text-[12px] text-ink/50">{inv.email}</div>
                </td>
                <td className="p-4 text-ink/80 font-mono text-[13px]">
                  {decrypt(inv.nid_number)}
                </td>
                <td className="p-4">
                  <KycToggle investorId={inv._id.toString()} initialStatus={inv.kyc_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
