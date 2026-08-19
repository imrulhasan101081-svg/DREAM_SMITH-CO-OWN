/* eslint-disable */
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import AzoCaresEntry from '@/lib/models/AzoCaresEntry';
import CaresForm from './CaresForm';

export default async function AdminCaresPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canView = isSuperAdmin || permissions.includes("cares.create");

  if (!canView) redirect("/admin/unauthorized");

  await dbConnect();

  const projects = await Project.find({}).lean();
  const entries = await AzoCaresEntry.find({})
    .populate('project_id', 'name')
    .sort({ date: -1 })
    .lean();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Azo Cares Ledger</h1>
        <p className="text-[14px] text-ink/60">Log charity distributions and community impact funded by our projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CaresForm projects={JSON.parse(JSON.stringify(projects))} />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="font-serif text-[20px] text-navy mb-6">Past Distributions</h2>
          
          <div className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Initiative</th>
                  <th className="p-4">Funding Source</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-ink/50">No charity distributions logged yet.</td>
                  </tr>
                )}
                {entries.map((entry: any) => (
                  <tr key={entry._id.toString()} className="border-t border-line-light">
                    <td className="p-4 text-ink/70">
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-medium text-navy">{entry.initiative}</td>
                    <td className="p-4 text-ink/80">{entry.project_id?.name || 'Unknown'}</td>
                    <td className="p-4 text-right font-medium text-gold-bright">
                      ৳{entry.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
