import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || (role !== "SUPER_ADMIN" && role !== "REGULAR_ADMIN")) {
    redirect("/admin/login");
  }

  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-ivory-dim flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-ivory flex flex-col fixed h-full z-10 overflow-y-auto custom-scrollbar">
        <div className="p-5 border-b border-ivory/10 flex items-center justify-center">
          <Link href="/admin" className="transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own Admin"
              width={180}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-6 text-[14px]">
          
          {/* Main Business */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ivory/40 font-mono mb-2 px-4">Business</div>
            <div className="space-y-1">
              <Link href="/admin" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Dashboard Overview</Link>
              <Link href="/admin/applications" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Applications Queue</Link>
              <Link href="/admin/investors" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Investor Management</Link>
              <Link href="/admin/projects" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Projects & Progress</Link>
            </div>
          </div>

          {/* CMS & Public Content */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ivory/40 font-mono mb-2 px-4">Public Content</div>
            <div className="space-y-1">
              <Link href="/admin/cares" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Azo Cares Ledger</Link>
              <Link href="/admin/media" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Media Library</Link>
              <Link href="/admin/content" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Site Content CMS</Link>
              <Link href="/admin/content/pricing" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Pricing Plans</Link>
              <Link href="/admin/messages" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Contact Messages</Link>
            </div>
          </div>

          {/* System Admin (Super Admin Only) */}
          {isSuperAdmin && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ivory/40 font-mono mb-2 px-4 text-gold-bright">System</div>
              <div className="space-y-1">
                <Link href="/admin/system/admins" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Admin Accounts</Link>
                <Link href="/admin/system/audit" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">Audit Logs</Link>
                <Link href="/admin/system/settings" className="block px-4 py-2 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">System Settings</Link>
              </div>
            </div>
          )}

        </nav>

        <div className="p-4 border-t border-ivory/10">
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center gap-2 mb-1">
              {isSuperAdmin ? (
                <span className="w-2 h-2 rounded-full bg-gold-bright"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-sage"></span>
              )}
              <div className="text-[10px] text-ivory/50 uppercase tracking-widest font-mono">
                {isSuperAdmin ? "Super Admin" : "Regular Admin"}
              </div>
            </div>
            <div className="text-[13px] font-medium truncate" title={session.user.name ?? ""}>{session.user.name}</div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10 max-w-[1600px]">
        {children}
      </main>
    </div>
  );
}
