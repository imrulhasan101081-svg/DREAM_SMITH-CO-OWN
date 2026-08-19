import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewAdminForm from "./NewAdminForm";
import { ALL_PERMISSIONS, REGULAR_ADMIN_DEFAULT_PERMISSIONS } from "@/lib/models/AdminUser";

export const dynamic = "force-dynamic";

export default async function NewAdminPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Create Admin Account</h1>
        <p className="text-[14px] text-ink/60">Add a new Regular Admin and configure their access permissions.</p>
      </div>

      <div className="card-elevated p-8">
        <NewAdminForm 
          availablePermissions={Object.values(ALL_PERMISSIONS)} 
          defaultPermissions={REGULAR_ADMIN_DEFAULT_PERMISSIONS}
        />
      </div>
    </div>
  );
}
