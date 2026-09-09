import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'Investor Security | Dream Smith Co-Own',
  description: 'Every safeguard, documented and shown: notarized agreements, post-dated security cheques, title-clear land verification, and verifiable digital certificates.',
};

export default async function SecurityPage() {
  const t = await getTranslations('Security');

  const safeguards = [
    { icon: '§', title: t('safeguards.agreement.title'), desc: t('safeguards.agreement.desc') },
    { icon: '৳', title: t('safeguards.cheque.title'), desc: t('safeguards.cheque.desc') },
    { icon: '⌂', title: t('safeguards.title_.title'), desc: t('safeguards.title_.desc') },
    { icon: '✓', title: t('safeguards.certificate.title'), desc: t('safeguards.certificate.desc') },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-ivory">
        <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-navy text-ivory text-center border-b border-gold/10">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
            <span className="eyebrow text-[11px] sm:text-[12px] tracking-[0.2em] text-gold-bright mb-4 sm:mb-6 block font-bold">{t('eyebrow')}</span>
            <h1 className="font-serif font-normal text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.01em] mb-4 sm:mb-6">
              {t('title')} <br /><em className="italic font-normal text-gold-bright">{t('titleEmphasis')}</em>
            </h1>
            <p className="text-[15.5px] sm:text-[17px] text-ivory/70 max-w-[580px] mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-24">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {safeguards.map((sec, i) => (
                <div key={i} className="bg-white border border-line-light p-6 sm:p-10 rounded-sm shadow-sm flex flex-col items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border border-gold rounded-full flex items-center justify-center shrink-0 text-gold font-serif italic text-[20px] sm:text-[24px]">
                    {sec.icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] sm:text-[18px] font-serif font-medium mb-2 sm:mb-3 text-navy">{sec.title}</h3>
                    <p className="text-[14px] sm:text-[14.5px] text-ink/70 leading-relaxed">{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 bg-navy p-6 sm:p-12 text-center text-ivory rounded-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-bright"></div>
               <h3 className="font-serif text-[22px] sm:text-[24px] mb-3 sm:mb-4">{t('sampleDocs.title')}</h3>
               <p className="text-ivory/70 text-[14.5px] sm:text-[15px] max-w-[500px] mx-auto mb-6 sm:mb-8 leading-relaxed">
                 {t('sampleDocs.description')}
               </p>
               <Link
                 href="mailto:info@dreamsmithproperties.com?subject=Request%20for%20Sample%20Legal%20Documents"
                 className="btn-gold px-8 py-3.5 text-[14.5px] font-medium inline-flex"
               >
                 {t('sampleDocs.requestButton')}
               </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
