import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const permissions = (session?.user as any)?.permissions || [];
  const isSuperAdmin = (session?.user as any)?.role === "SUPER_ADMIN";
  const canCreate = isSuperAdmin || permissions.includes("project.create");
  const canUpdate = isSuperAdmin || permissions.includes("project.update");

  const projects = await Project.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Projects & Progress</h1>
          <p className="text-[14px] text-ink/60">Manage project details and post immutable construction updates.</p>
        </div>
        {canCreate && (
          <Link href="/admin/projects/new" className="bg-navy text-ivory px-6 py-2.5 rounded-sm hover:bg-navy-light transition-colors text-[14px] font-medium">
            + Add New Project
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.length === 0 && (
          <div className="col-span-2 text-center p-12 bg-white border border-line-light rounded-sm">
            <p className="text-ink/50">No projects found.</p>
          </div>
        )}
        
        {projects.map((project: any) => (
          <div key={project._id.toString()} className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden flex flex-col relative">
            {!project.isPublished && (
              <div className="absolute top-4 right-4 z-20 bg-ink text-white text-[10px] uppercase font-mono px-2 py-1 rounded-sm tracking-widest">
                Draft
              </div>
            )}
            <div className="h-32 bg-navy flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541888087474-325b7a1ce38b?q=80&w=2070')] bg-cover bg-center"></div>
               <div className="relative z-10 text-center">
                 <h2 className="font-serif text-[24px] text-ivory mb-1">{project.name}</h2>
                 <span className="bg-sage text-white px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">{project.status.replace('_', ' ')}</span>
               </div>
            </div>
            
            <div className="p-6 flex-1">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                <div>
                  <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">Shares Reserved</div>
                  <div className="text-[15px] font-medium text-navy">{project.shares_reserved || 0} / {project.total_shares}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">Price per Share</div>
                  <div className="text-[15px] font-medium text-navy">৳{project.price_per_share?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">Buy-Back</div>
                  <div className="text-[15px] font-medium text-navy">৳{project.buyback_amount?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">Term Length</div>
                  <div className="text-[15px] font-medium text-navy">{project.term_months} Months</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-line-light">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-ink/50 uppercase tracking-widest font-mono">Construction</span>
                  <span className="text-[13px] font-medium text-navy">{project.constructionProgress}%</span>
                </div>
                <div className="w-full bg-ivory h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full rounded-full" style={{ width: `${project.constructionProgress}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-line-light bg-ivory-dim p-4 flex gap-3">
              {canUpdate ? (
                <Link 
                  href={`/admin/projects/${project._id.toString()}`}
                  className="flex-1 bg-white border border-line-light text-navy text-center px-4 py-2.5 text-[13px] font-medium rounded-sm hover:bg-ivory transition-colors"
                >
                  Edit Details
                </Link>
              ) : (
                <button disabled className="flex-1 bg-white border border-line-light text-navy px-4 py-2.5 text-[13px] font-medium rounded-sm opacity-50 cursor-not-allowed">
                  Edit Details
                </button>
              )}
              
              <Link
                href={`/admin/projects/${project._id.toString()}/progress`}
                className="flex-1 bg-navy text-ivory text-center px-4 py-2.5 text-[13px] font-medium rounded-sm hover:bg-navy-deep transition-colors"
              >
                Progress Updates
              </Link>

              {canUpdate ? (
                <Link
                  href={`/admin/projects/${project._id.toString()}/media`}
                  className="flex-1 bg-white border border-line-light text-navy text-center px-4 py-2.5 text-[13px] font-medium rounded-sm hover:bg-ivory transition-colors"
                >
                  Media Gallery
                </Link>
              ) : (
                <button disabled className="flex-1 bg-white border border-line-light text-navy px-4 py-2.5 text-[13px] font-medium rounded-sm opacity-50 cursor-not-allowed">
                  Media Gallery
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
