import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canUpdate = isSuperAdmin || permissions.includes("project.update");

  if (!canUpdate) redirect("/admin/unauthorized");

  await dbConnect();
  const project = await Project.findById(params.id).lean();

  if (!project) redirect("/admin/projects");

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Edit Project: {project.name}</h1>
        <p className="text-[14px] text-ink/60">Update project details, financial terms, and descriptions.</p>
      </div>

      <div className="card-elevated p-8">
        <ProjectForm project={JSON.parse(JSON.stringify(project))} />
      </div>
    </div>
  );
}
