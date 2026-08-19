import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import MediaAsset from "@/lib/models/MediaAsset";
import GlobalMediaManager from "./GlobalMediaManager";

export const dynamic = "force-dynamic";

export default async function GlobalMediaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const permissions = (session.user as any).permissions || [];
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const canUpload = isSuperAdmin || permissions.includes("media.upload");
  const canDelete = isSuperAdmin || permissions.includes("media.delete");

  if (!isSuperAdmin && !canUpload && !canDelete) {
    // If they can't upload or delete, check if they can even view it. We didn't define a media.view, but they should have at least upload or delete to access the library.
    redirect("/admin/unauthorized");
  }

  await dbConnect();
  
  const media = await MediaAsset.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">Global Media Library</h1>
          <p className="text-[14px] text-ink/60">Centralized repository for all uploaded images, PDFs, and assets.</p>
        </div>
      </div>

      <div className="card-elevated p-8">
        <GlobalMediaManager 
          initialMedia={JSON.parse(JSON.stringify(media))} 
          canUpload={canUpload}
          canDelete={canDelete}
        />
      </div>
    </div>
  );
}
