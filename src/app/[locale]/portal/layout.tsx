import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import LogoutButton from "../admin/(protected)/LogoutButton";
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

  const navItems = [
    { href: "/portal", label: t('nav.dashboard'), icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/portal/holdings", label: t('nav.holdings'), icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { href: "/portal/certificates", label: t('nav.certificates'), icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
    { href: "/portal/documents", label: t('nav.documents'), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: "/portal/profile", label: t('nav.profile'), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="min-h-screen bg-ivory-dim">
      {/* ── Desktop Sidebar (hidden on mobile) ──────────────────────────── */}
      <aside className="w-64 bg-navy-deep text-ivory flex flex-col fixed h-full z-10 hidden lg:flex">
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
        <nav className="flex-1 py-6 px-4 space-y-1 text-[14px] overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
          <Link href="/portal/cares" className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory text-[14px]">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t('nav.cares')}
          </Link>
          <Link href="/portal/notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-ivory/70 hover:text-ivory text-[14px]">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {t('nav.notifications')}
          </Link>
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

      {/* ── Mobile Top Bar (hidden on desktop) ──────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 bg-navy-deep border-b border-gold/20 flex items-center justify-between px-4 py-3">
        <Link href="/portal" className="transition-opacity hover:opacity-90">
          <Image
            src="/images/logo/official-logo-full.png"
            alt="Dream Smith Co-Own"
            width={160}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <LogoutButton callbackUrl={`/${locale}/login`} />
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 min-h-screen">
        {children}
      </main>

      {/* ── Mobile Bottom Navigation ─────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-navy-deep border-t border-gold/20 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-3 px-2 text-ivory/60 hover:text-gold-bright transition-colors min-w-0"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="text-[10px] font-mono tracking-wide uppercase truncate max-w-[56px] text-center leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
