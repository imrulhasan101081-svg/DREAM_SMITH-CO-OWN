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

      <main className="pt-32 pb-24 min-h-screen bg-ivory">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="mb-12">
            <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('eyebrow')}</span>
            <h1 className="font-serif font-normal text-[clamp(32px,4vw,48px)] leading-[1.15] tracking-[-0.01em] mb-6 text-navy">
              {t('title')} <em className="italic text-gold">{t('titleEmphasis')}</em>
            </h1>
            <p className="text-[17px] text-ink/70 leading-relaxed mb-8">
              {t('description')}
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="font-serif text-[24px] text-navy mb-4">{t('sections.s1.title')}</h2>
              <p className="text-[15px] text-ink/70 leading-relaxed mb-4">
                {t('sections.s1.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-navy mb-4">{t('sections.s2.title')}</h2>
              <p className="text-[15px] text-ink/70 leading-relaxed mb-4">
                {t('sections.s2.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-navy mb-4">{t('sections.s3.title')}</h2>
              <p className="text-[15px] text-ink/70 leading-relaxed mb-4">
                {t('sections.s3.desc')}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-navy mb-4">{t('sections.s4.title')}</h2>
              <p className="text-[15px] text-ink/70 leading-relaxed mb-4">
                {t('sections.s4.desc')}
              </p>
            </section>
          </div>

          <div className="mt-16 pt-12 border-t border-line-light text-center">
            <h3 className="font-serif text-[22px] text-navy mb-4">{t('readyTitle')}</h3>
            <Link href="/apply" className="inline-block bg-gold text-navy-deep px-8 py-3.5 text-[14.5px] font-semibold rounded-sm transition-all hover:bg-gold-bright">
              {t('viewProjects')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
