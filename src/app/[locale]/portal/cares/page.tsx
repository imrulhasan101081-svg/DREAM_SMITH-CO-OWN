import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from "@/i18n/navigation";
import dbConnect from "@/lib/db";
import AzoCaresEntry from "@/lib/models/AzoCaresEntry";
import Project from "@/lib/models/Project";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PortalCaresPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect({ href: "/login", locale: await getLocale() });

  const t = await getTranslations('Portal.cares');

  await dbConnect();
  Project.findOne(); // register model

  const entries = await AzoCaresEntry.find({})
    .populate('project_id', 'name')
    .sort({ date: -1 })
    .lean();

  const totalDistributed = entries.reduce((sum: number, entry: any) => sum + (entry.amount || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">{t('title')}</h1>
        <p className="text-[14px] text-ink/60">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="card-elevated p-8 border-l-4 border-l-sage">
          <div className="font-mono text-[11px] tracking-widest text-ink/50 uppercase mb-2">{t('totalDistributed')}</div>
          <div className="font-serif text-[36px] text-navy tabular-nums">৳{totalDistributed.toLocaleString()}</div>
        </div>
        <div className="card-elevated p-8 border-l-4 border-l-gold-bright">
          <div className="font-mono text-[11px] tracking-widest text-ink/50 uppercase mb-2">{t('totalInitiatives')}</div>
          <div className="font-serif text-[36px] text-navy tabular-nums">{entries.length}</div>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="bg-ivory-dim border-b border-line-light p-6">
          <h2 className="font-serif text-[20px] text-navy">{t('ledgerTitle')}</h2>
        </div>
        <div className="p-0">
          {entries.length === 0 && (
            <div className="text-center p-12 text-ink/50">
              {t('emptyState')}
            </div>
          )}

          <div className="divide-y divide-line-light">
            {entries.map((entry: any) => (
              <div key={entry._id.toString()} className="p-8 flex flex-col lg:flex-row gap-8 hover:bg-ivory/30 transition-colors">
                <div className="lg:w-48 shrink-0">
                  <div className="text-[12px] text-ink/50 font-mono tracking-widest uppercase mb-1">{t('date')}</div>
                  <div className="font-serif text-[20px] text-navy">
                    {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="mt-4">
                    <div className="text-[12px] text-ink/50 font-mono tracking-widest uppercase mb-1">{t('fundedVia')}</div>
                    <div className="text-[14px] text-gold-bright font-medium">
                      {entry.project_id?.name || t('unknownProject')}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-[22px] text-navy mb-2">{entry.initiative}</h3>
                  <div className="text-[28px] font-medium text-sage mb-4">
                    ৳{(entry.amount || 0).toLocaleString()}
                  </div>
                  {entry.description && (
                    <p className="text-[14px] text-ink/80 leading-relaxed max-w-2xl">
                      {entry.description}
                    </p>
                  )}
                </div>

                {entry.evidence && entry.evidence.length > 0 && (
                  <div className="lg:w-64 shrink-0 grid gap-2" style={{
                    gridTemplateColumns: entry.evidence.length === 1 ? '1fr' : '1fr 1fr',
                    gridAutoRows: 'min-content'
                  }}>
                    {entry.evidence.map((img: string, i: number) => (
                      <div key={i} className={`relative aspect-square border border-line-light rounded-sm overflow-hidden ${entry.evidence.length === 3 && i === 0 ? 'col-span-2 aspect-[2/1]' : ''}`}>
                        <Image
                          src={img}
                          alt={`Evidence ${i + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 128px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
