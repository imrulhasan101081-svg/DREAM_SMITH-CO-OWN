import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import LogoutButton from "../admin/(protected)/LogoutButton"; // Reuse the same button component
import Image from "next/image";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function PortalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "investor") {
    redirect({ href: "/login", locale });
  }

  const t = await getTranslations('Portal.layout');

  return (
    <div className="min-h-screen bg-ivory-dim flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-deep text-ivory flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-gold/20 flex items-center justify-center">
          <Link href="/portal" className="transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own"
              width={180}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 text-[14px]">
          <Link href="/portal" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.dashboard')}</Link>
          <Link href="/portal/holdings" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.holdings')}</Link>
          <Link href="/portal/certificates" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.certificates')}</Link>
          <Link href="/portal/documents" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.documents')}</Link>
          <Link href="/portal/cares" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.cares')}</Link>
          <Link href="/portal/notifications" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.notifications')}</Link>
          <Link href="/portal/profile" className="block px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory">{t('nav.profile')}</Link>
        </nav>

        <div className="p-4 border-t border-gold/20">
          <div className="px-4 py-2 mb-2 flex items-center justify-between">
            <div>
              <div className="text-[12px] text-ivory/40 uppercase tracking-widest font-mono">{t('welcome')}</div>
              <div className="text-[14px] truncate max-w-[120px]">{session.user.name}</div>
            </div>
            <LocaleSwitcher />
          </div>
          <LogoutButton callbackUrl={`/${locale}/login`} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}
