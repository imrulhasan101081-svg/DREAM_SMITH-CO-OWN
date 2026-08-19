import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from "@/i18n/navigation";

export const metadata = {
  title: 'Legal Documents | Investor Portal',
};

export default async function PortalDocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect({ href: "/login", locale: await getLocale() });

  const t = await getTranslations('Portal.documents');

  // In a real application, these might be fetched from the database or an S3 bucket.
  const documents = [
    {
      title: "Master Co-Ownership Agreement Template",
      description: "The standard bilingual legal agreement signed and notarized by all fractional investors.",
      category: "Legal Core",
      date: "01 Jan 2026",
      size: "245 KB",
      format: "PDF"
    },
    {
      title: "Chihno Title Search Report",
      description: "Advocate-certified title search confirming the land for Dream Smith Chihno is unencumbered.",
      category: "Project Security",
      date: "15 Jan 2026",
      size: "1.2 MB",
      format: "PDF"
    },
    {
      title: "Platform Terms of Service",
      description: "Digital platform usage rules, data privacy, and electronic certificate validity terms.",
      category: "Policies",
      date: "10 Feb 2026",
      size: "110 KB",
      format: "PDF"
    },
    {
      title: "Buy-Back Guarantee Terms",
      description: "Detailed explanation of the 36-month buy-back protocol and post-dated cheque issuance.",
      category: "Legal Core",
      date: "01 Jan 2026",
      size: "180 KB",
      format: "PDF"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">{t('title')}</h1>
        <p className="text-[14px] text-ink/60">{t('description')}</p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, i) => (
          <div key={i} className="card-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition-colors">
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded bg-ivory flex items-center justify-center border border-line-light shrink-0 text-gold-bright font-serif text-[20px]">
                §
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h2 className="font-serif text-[18px] text-navy leading-none">{doc.title}</h2>
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-line-light text-ink/60 px-2 py-0.5 rounded">{doc.category}</span>
                </div>
                <p className="text-[13.5px] text-ink/70 max-w-xl leading-relaxed mb-3">
                  {doc.description}
                </p>
                <div className="flex gap-4 text-[11px] font-mono text-ink/40 tracking-wider">
                  <span>{t('updated', { date: doc.date })}</span>
                  <span>{t('format', { format: doc.format })}</span>
                  <span>{t('size', { size: doc.size })}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 pt-4 md:pt-0 border-t border-line-light md:border-t-0 md:pl-6 md:border-l md:h-full flex items-center">
              <button className="text-[13px] font-medium text-navy hover:text-gold-bright transition-colors flex items-center gap-2">
                {t('download')}
                <span className="text-[16px]">↓</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
