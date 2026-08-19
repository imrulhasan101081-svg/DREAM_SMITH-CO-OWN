import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect, Link } from "@/i18n/navigation";
import dbConnect from "@/lib/db";
import Holding from "@/lib/models/Holding";
import Project from "@/lib/models/Project";
import ProgressUpdate from "@/lib/models/ProgressUpdate";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HoldingDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  if (!session) redirect({ href: "/login", locale });

  const t = await getTranslations('Portal.holdingDetail');

  await dbConnect();
  Project.findOne();

  const holding = await Holding.findOne({ _id: params.id, investor_id: session.user.id })
    .populate('project_id')
    .lean();

  if (!holding) {
    redirect({ href: "/portal/holdings", locale });
    return;
  }

  const project = holding.project_id as any;
  const principal = holding.share_count * (project?.price_per_share || 0);
  const buyback = holding.share_count * (project?.buyback_amount || 0);

  // Fetch progress updates for this project (guard against a deleted/unpopulated project)
  const updates = project?._id
    ? await ProgressUpdate.find({ project_id: project._id })
        .sort({ date: -1 })
        .lean()
    : [];

  return (
    <div>
      <div className="mb-8">
        <Link href="/portal/holdings" className="text-[13px] text-ink/50 hover:text-navy transition-colors mb-2 inline-block">
          {t('backToHoldings')}
        </Link>
        <h1 className="font-serif text-[28px] text-navy mb-1">{project?.name || t('unknownProject')}</h1>
        <p className="text-[14px] text-ink/60">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card-elevated p-8">
            <h2 className="font-mono text-[13px] tracking-widest text-ink/50 uppercase border-b border-line-light pb-3 mb-6">{t('financialSummary')}</h2>

            <div className="space-y-5">
              <div>
                <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('sharesOwned')}</div>
                <div className="text-[15px] font-medium text-navy tabular-nums">{t('unit', { count: holding.share_count })}</div>
              </div>
              <div>
                <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('totalInvested')}</div>
                <div className="text-[15px] font-medium text-navy tabular-nums">৳{principal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('guaranteedBuyback')}</div>
                <div className="text-[18px] font-medium text-gold-bright tabular-nums">৳{buyback.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('maturityDate')}</div>
                <div className="text-[15px] font-medium text-navy">
                  {new Date(holding.maturity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line-light">
              <Link
                href={`/portal/holdings/${holding._id.toString()}/certificate`}
                className="block w-full bg-navy text-ivory px-6 py-3 text-[14px] font-medium rounded-sm hover:bg-navy-deep transition-all hover:shadow-md text-center"
              >
                {t('viewDigitalCertificate')}
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card-elevated p-8">
            <h2 className="font-mono text-[13px] tracking-widest text-ink/50 uppercase border-b border-line-light pb-3 mb-8">{t('constructionProgressUpdates')}</h2>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-line-light before:to-transparent">
              {updates.length === 0 && (
                <div className="text-center p-8 bg-ivory-dim text-ink/50 border border-line-light rounded-sm">
                  {t('noUpdates')}
                </div>
              )}

              {updates.map((update: any) => (
                <div key={update._id.toString()} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sage text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-serif italic text-[16px]">✓</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-line-light p-6 rounded-sm shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-sage/10 text-sage px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider mb-2 inline-block">
                          {update.phase.replace('_', ' ')}
                        </span>
                        <div className="text-[13px] font-medium text-navy">
                          {new Date(update.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <p className="text-[14px] text-ink/80 leading-relaxed mb-4">
                      {update.description}
                    </p>
                    {update.photos && update.photos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {update.photos.map((photo: string, i: number) => (
                          <div key={i} className="aspect-video bg-ivory-dim rounded-sm relative overflow-hidden border border-line-light">
                             <Image
                               src={photo}
                               alt="Progress"
                               fill
                               sizes="(max-width: 768px) 50vw, 25vw"
                               className="object-cover"
                               unoptimized
                             />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
