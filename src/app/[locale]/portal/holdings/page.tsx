import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import dbConnect from "@/lib/db";
import Holding from "@/lib/models/Holding";
import Project from "@/lib/models/Project";
import { Link } from "@/i18n/navigation";

export default async function HoldingsList() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const t = await getTranslations('Portal.holdings');

  await dbConnect();
  Project.findOne();

  const holdings = await Holding.find({ investor_id: session.user.id })
    .populate('project_id')
    .sort({ purchase_date: -1 })
    .lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-navy mb-1">{t('title')}</h1>
          <p className="text-[14px] text-ink/60">{t('description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {holdings.length === 0 && (
          <div className="bg-white border border-line-light p-12 rounded-sm text-center">
            <p className="text-ink/50">{t('emptyState')}</p>
          </div>
        )}

        {holdings.map((h: any) => {
          const project = h.project_id;
          const principal = h.share_count * (project?.price_per_share || 0);
          const buyback = h.share_count * (project?.buyback_amount || 0);

          return (
            <div key={h._id.toString()} className="card-elevated p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-navy"></div>

               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-serif text-[22px] text-navy">{project?.name || t('unknownProject')}</h2>
                    <span className="badge-sage uppercase">
                      {h.status}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 mt-6">
                    <div>
                      <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('shares')}</div>
                      <div className="text-[15px] font-medium text-navy tabular-nums">{t('unit', { count: h.share_count })}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('invested')}</div>
                      <div className="text-[15px] font-medium text-navy tabular-nums">৳{principal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('guaranteedBuyback')}</div>
                      <div className="text-[15px] font-medium text-gold-bright tabular-nums">৳{buyback.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('maturityDate')}</div>
                      <div className="text-[15px] font-medium text-navy">
                        {new Date(h.maturity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                 </div>
               </div>

               <div className="w-full md:w-auto mt-4 md:mt-0">
                 <Link
                   href={`/portal/holdings/${h._id.toString()}/certificate`}
                   className="inline-block w-full md:w-auto bg-navy text-ivory px-6 py-3 text-[14px] font-medium rounded-sm hover:bg-navy-deep transition-all hover:shadow-md text-center"
                 >
                   {t('viewCertificate')}
                 </Link>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
