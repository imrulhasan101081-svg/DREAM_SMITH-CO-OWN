import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import ProgressUpdate from '@/lib/models/ProgressUpdate';
import Link from 'next/link';
import Image from 'next/image';
import ProgressForm from './ProgressForm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProgressPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canUpdate = isSuperAdmin || permissions.includes("project.update");

  if (!canUpdate) redirect("/admin/unauthorized");

  await dbConnect();
  
  const project = await Project.findById(params.id).lean();
  if (!project) {
    redirect("/admin/projects");
  }

  const updates = await ProgressUpdate.find({ project_id: params.id })
    .sort({ date: -1 })
    .lean();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="text-[13px] text-ink/50 hover:text-navy transition-colors mb-2 inline-block">
          ← Back to Projects
        </Link>
        <h1 className="font-serif text-[28px] text-navy mb-1">{project.name}</h1>
        <p className="text-[14px] text-ink/60">Progress Updates Feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProgressForm projectId={params.id} />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="font-serif text-[20px] text-navy mb-6">Past Updates</h2>
          
          <div className="space-y-6">
            {updates.length === 0 && (
              <div className="bg-white border border-line-light p-8 rounded-sm text-center text-ink/50">
                No updates posted yet.
              </div>
            )}
            
            {updates.map((update: any) => (
              <div key={update._id.toString()} className="bg-white border border-line-light p-6 rounded-sm shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-sage/10 text-sage px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider mb-2 inline-block">
                      {update.phase.replace('_', ' ')}
                    </span>
                    <div className="text-[13px] text-ink/50">
                      {new Date(update.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-[11px] text-ink/40">Posted by {update.posted_by}</div>
                </div>
                
                <p className="text-[14.5px] text-ink/80 leading-relaxed mb-4">
                  {update.description}
                </p>
                
                {update.photos && update.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {update.photos.map((photo: string, i: number) => (
                      <div key={i} className="aspect-video bg-ivory-dim rounded-sm relative overflow-hidden border border-line-light">
                         <Image
                           src={photo}
                           alt="Progress"
                           fill
                           sizes="(max-width: 640px) 50vw, 33vw"
                           className="object-cover"
                           unoptimized
                         />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
