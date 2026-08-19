import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SystemSettingsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">System Settings</h1>
        <p className="text-[14px] text-ink/60">Configure global platform behavior and integrations.</p>
      </div>

      <div className="card-elevated p-8 text-center text-ink/60">
        <div className="w-16 h-16 mx-auto bg-ivory rounded-full flex items-center justify-center mb-4 text-ink/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="mb-2">Advanced settings are currently managed via environment variables.</p>
        <p className="text-[12px]">Future updates will bring Email Templates, API Keys, and Backup settings to this interface.</p>
      </div>
    </div>
  );
}
