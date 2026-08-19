import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import dbConnect from "@/lib/db";
import Holding from "@/lib/models/Holding";
import Project from "@/lib/models/Project";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const t = await getTranslations('Portal.certificates');

  await dbConnect();
  Project.findOne();

  const holdings = await Holding.find({ investor_id: session.user.id, status: 'active' })
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {holdings.length === 0 && (
          <div className="col-span-full bg-white border border-line-light p-12 rounded-sm text-center">
            <p className="text-ink/50">{t('emptyState')}</p>
          </div>
        )}

        {holdings.map((h: any) => {
          const project = h.project_id;

          return (
            <div key={h._id.toString()} className="bg-gradient-to-br from-[#FBF8F0] to-[#F3EDDC] border border-gold rounded text-ink p-7 pb-6 relative shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:inset-2 before:border before:border-gold/50 before:rounded-sm before:pointer-events-none flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="font-mono text-[9px] text-gold tracking-widest mt-1">{t('certNo', { id: h._id.toString().slice(-8).toUpperCase() })}</div>
                <div className="w-10 h-10 rounded-full border-[1.5px] border-gold p-0.5 flex items-center justify-center shrink-0 overflow-hidden bg-navy shadow-sm">
                  <Image
                    src="/images/logo/official-logo-icon.png"
                    alt="Official Seal"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="font-serif text-[11px] tracking-[0.16em] uppercase text-navy text-center mb-1">Dream Smith Properties Pvt. Ltd.</div>
              <div className="font-serif italic text-[18px] text-center text-gold mb-5">{t('certificateTitle')}</div>

              <div className="flex justify-between text-[11px] py-1.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('holderLabel')}</span><span className="font-semibold font-serif truncate max-w-[120px] text-right">{session.user.name}</span></div>
              <div className="flex justify-between text-[11px] py-1.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('projectLabel')}</span><span className="font-semibold font-serif truncate max-w-[120px] text-right">{project?.name}</span></div>
              <div className="flex justify-between text-[11px] py-1.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('shareLabel')}</span><span className="font-semibold font-serif truncate max-w-[120px] text-right">{t('shareValue', { sqft: h.share_count * 100, count: h.share_count })}</span></div>
              <div className="flex justify-between text-[11px] py-1.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('maturesLabel')}</span><span className="font-semibold font-serif">{new Date(h.maturity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>

              <div className="mt-6 pt-4 flex gap-3 mt-auto relative z-10">
                <Link
                  href={`/portal/holdings/${h._id.toString()}/certificate`}
                  className="flex-1 bg-navy text-ivory py-2 text-[12px] font-medium rounded-sm hover:bg-navy-deep transition-all text-center"
                >
                  {t('viewFull')}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
