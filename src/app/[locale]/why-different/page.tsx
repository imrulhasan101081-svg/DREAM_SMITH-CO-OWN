import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import { Link } from '@/i18n/navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Why We Are Different | Dream Smith Co-Own',
  description: 'Understand the unique approach to fractional real estate co-ownership in Rajshahi. Notarized, secure, and fully documented.',
};

export default async function WhyDifferentPage() {
  const t = await getTranslations('WhyDifferent');

  return (
    <>
      <Header />

      <main className="pt-20 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-ivory">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-8 sm:mb-12">
            <span className="eyebrow text-[11px] sm:text-[12px] tracking-[0.2em] text-gold mb-3 sm:mb-4 block font-bold">{t('eyebrow')}</span>
            <h1 className="font-serif font-normal text-[clamp(30px,4vw,48px)] leading-[1.15] tracking-[-0.01em] mb-4 sm:mb-6 text-navy">
              {t('title')} <em className="italic text-gold">{t('titleEmphasis')}</em>
            </h1>
            <p className="text-[15.5px] sm:text-[17px] text-ink/70 leading-relaxed mb-6 sm:mb-8">
              {t('description')}
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="font-serif text-[22px] sm:text-[24px] text-navy mb-3 sm:mb-4">{t('sections.s1.title')}</h2>
              <p className="text-[14.5px] sm:text-[15px] text-ink/70 leading-relaxed">
                {t('sections.s1.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[22px] sm:text-[24px] text-navy mb-3 sm:mb-4">{t('sections.s2.title')}</h2>
              <p className="text-[14.5px] sm:text-[15px] text-ink/70 leading-relaxed">
                {t('sections.s2.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[22px] sm:text-[24px] text-navy mb-3 sm:mb-4">{t('sections.s3.title')}</h2>
              <p className="text-[14.5px] sm:text-[15px] text-ink/70 leading-relaxed">
                {t('sections.s3.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[22px] sm:text-[24px] text-navy mb-3 sm:mb-4">{t('sections.s4.title')}</h2>
              <p className="text-[14.5px] sm:text-[15px] text-ink/70 leading-relaxed">
                {t('sections.s4.desc')}
              </p>
            </section>
          </div>

          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-line-light text-center">
            <h3 className="font-serif text-[20px] sm:text-[22px] text-navy mb-4">{t('readyTitle')}</h3>
            <Link href="/apply" className="btn-gold px-9 py-4 text-[14.5px]">
              {t('viewProjects')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
