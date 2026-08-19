import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';

export const metadata = {
  title: 'Investor Security | Dream Smith Co-Own',
  description: 'Every safeguard, documented and shown: notarized agreements, post-dated security cheques, title-clear land verification, and verifiable digital certificates.',
};

export default async function SecurityPage() {
  const t = await getTranslations('Security');

  const safeguards = [
    { icon: '§', title: t('safeguards.agreement.title'), desc: t('safeguards.agreement.desc') },
    { icon: '₹', title: t('safeguards.cheque.title'), desc: t('safeguards.cheque.desc') },
    { icon: '⌂', title: t('safeguards.title_.title'), desc: t('safeguards.title_.desc') },
    { icon: '✓', title: t('safeguards.certificate.title'), desc: t('safeguards.certificate.desc') },
  ];

  return (
    <main className="min-h-screen bg-ivory">
      <Header />

      <section className="pt-24 pb-16 bg-navy text-ivory text-center border-b border-gold/10">
        <div className="max-w-[800px] mx-auto px-8">
          <span className="font-mono text-[12px] tracking-[0.14em] text-gold-bright uppercase mb-6 block">{t('eyebrow')}</span>
          <h1 className="font-serif font-normal text-[clamp(36px,4vw,52px)] leading-[1.06] tracking-[-0.01em] mb-6">
            {t('title')} <br /><em className="italic font-normal text-gold-bright">{t('titleEmphasis')}</em>
          </h1>
          <p className="text-[17px] text-ivory/70 max-w-[580px] mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {safeguards.map((sec, i) => (
              <div key={i} className="bg-white border border-line-light p-10 rounded-sm shadow-sm flex flex-col items-start gap-6">
                <div className="w-14 h-14 border border-gold rounded-full flex items-center justify-center shrink-0 text-gold font-serif italic text-[24px]">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="text-[18px] font-serif font-medium mb-3 text-navy">{sec.title}</h3>
                  <p className="text-[14.5px] text-ink/70 leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-navy p-12 text-center text-ivory rounded-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-bright"></div>
             <h3 className="font-serif text-[24px] mb-4">{t('sampleDocs.title')}</h3>
             <p className="text-ivory/70 text-[15px] max-w-[500px] mx-auto mb-8">
               {t('sampleDocs.description')}
             </p>
             <a
               href="mailto:info@dreamsmithproperties.com?subject=Request%20for%20Sample%20Legal%20Documents"
               className="border border-gold text-gold-bright px-8 py-3.5 text-[14.5px] font-medium rounded-sm transition-all hover:bg-gold/10 inline-block"
             >
               {t('sampleDocs.requestButton')}
             </a>
          </div>
        </div>
      </section>

      <footer className="bg-navy-deep text-ivory/50 py-10 border-t border-gold/10 text-[13px] text-center">
        <div className="max-w-[1180px] mx-auto px-8">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </main>
  );
}
