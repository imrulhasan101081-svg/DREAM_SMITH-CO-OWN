import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";
import CMSForm from "./CMSForm";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canUpdate = isSuperAdmin || permissions.includes("content.update");

  if (!canUpdate) redirect("/admin/unauthorized");

  await dbConnect();
  
  const contentDocs = await SiteContent.find({}).lean();
  
  // Group content by section
  const contentBySection = contentDocs.reduce((acc: any, doc: any) => {
    if (!acc[doc.section]) acc[doc.section] = [];
    acc[doc.section].push(doc);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Site Content Management</h1>
        <p className="text-[14px] text-ink/60">Manage public-facing text, contact information, and policies.</p>
      </div>

      <div className="space-y-8">
        {Object.entries(contentBySection).map(([section, fields]: [string, any]) => (
          <div key={section} className="card-elevated overflow-hidden">
            <div className="bg-ivory-dim border-b border-line-light p-4">
              <h2 className="text-[16px] font-medium text-navy uppercase tracking-widest">{section}</h2>
            </div>
            <div className="p-6">
              <CMSForm section={section} fields={fields} />
            </div>
          </div>
        ))}

        {Object.keys(contentBySection).length === 0 && (
          <div className="text-center p-12 bg-white border border-line-light rounded-sm text-ink/50">
            No site content fields have been seeded yet. Run the seeder.
          </div>
        )}
      </div>
    </div>
  );
}
