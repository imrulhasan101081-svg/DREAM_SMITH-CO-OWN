import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import dbConnect from "@/lib/db";
import Holding from "@/lib/models/Holding";
import Project from "@/lib/models/Project";
import { Link } from "@/i18n/navigation";

export default async function PortalDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const t = await getTranslations('Portal.dashboard');

  await dbConnect();

  // Ensure Project model is populated
  Project.findOne();

  const holdings = await Holding.find({ investor_id: session.user.id })
    .populate('project_id')
    .sort({ purchase_date: -1 })
    .lean();

  let totalShares = 0;
  let totalInvested = 0;
  let nearestMaturity: Date | null = null;

  holdings.forEach((h: any) => {
    totalShares += h.share_count;
    totalInvested += (h.share_count * (h.project_id?.price_per_share || 0));

    if (h.status === 'active') {
      const matDate = new Date(h.maturity_date);
      if (!nearestMaturity || matDate < nearestMaturity) {
        nearestMaturity = matDate;
      }
    }
  });

  return (
    <div>
      <h1 className="font-serif text-[28px] text-navy mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-elevated p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">{t('totalSharesHeld')}</div>
          <div className="font-serif text-[36px] text-navy tabular-nums">{totalShares}</div>
          <div className="text-[13px] text-ink/50 mt-1">{t('acrossAllProjects')}</div>
        </div>

        <div className="card-elevated p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-navy"></div>
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">{t('totalInvested')}</div>
          <div className="font-serif text-[36px] text-navy tabular-nums">৳{totalInvested.toLocaleString()}</div>
          <div className="text-[13px] text-ink/50 mt-1">{t('principalAmount')}</div>
        </div>

        <div className="card-elevated p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-sage"></div>
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">{t('nearestMaturity')}</div>
          <div className="font-serif text-[30px] text-navy">
            {nearestMaturity
              ? (nearestMaturity as Date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
              : t('notAvailable')
            }
          </div>
          <div className="text-[13px] text-ink/50 mt-1">{t('buybackEligibleDate')}</div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="font-serif text-[22px] text-navy">{t('recentHoldings')}</h2>
        <Link href="/portal/holdings" className="text-[13px] font-medium text-gold-bright hover:text-gold transition-colors">
          {t('viewAll')}
        </Link>
      </div>

      <div className="card-elevated overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">{t('table.project')}</th>
              <th className="p-4">{t('table.shares')}</th>
              <th className="p-4">{t('table.purchaseDate')}</th>
              <th className="p-4">{t('table.status')}</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {holdings.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink/50">{t('emptyState')}</td>
              </tr>
            )}
            {holdings.slice(0, 3).map((h: any) => (
              <tr key={h._id.toString()} className="border-t border-line-light hover:bg-ivory/50 transition-colors">
                <td className="p-4 font-medium text-navy">{h.project_id?.name || t('unknownProject')}</td>
                <td className="p-4 font-mono text-[13px] tabular-nums">{h.share_count}</td>
                <td className="p-4 text-ink/70">
                  {new Date(h.purchase_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <span className="badge-sage uppercase">
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
