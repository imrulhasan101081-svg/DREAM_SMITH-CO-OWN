import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';

export const metadata = {
  title: 'How It Works | Dream Smith Co-Own',
  description: 'A simple, fully documented structure: reserve your share, sign a notarized agreement, track construction, and receive your guaranteed buy-back.',
};

export default async function HowItWorks() {
  const t = await getTranslations('HowItWorks');

  const steps = [
    { num: '01', title: t('steps.step1.title'), desc: t('steps.step1.desc') },
    { num: '02', title: t('steps.step2.title'), desc: t('steps.step2.desc') },
    { num: '03', title: t('steps.step3.title'), desc: t('steps.step3.desc') },
    { num: '04', title: t('steps.step4.title'), desc: t('steps.step4.desc') },
  ];

  return (
    <main className="min-h-screen bg-ivory">
      <Header />

      {/* PAGE HERO */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-navy to-navy-deep text-ivory">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <span className="font-mono text-[12px] tracking-[0.14em] text-gold-bright uppercase mb-6 block">{t('eyebrow')}</span>
          <h1 className="font-serif font-normal text-[clamp(36px,4vw,52px)] leading-[1.06] tracking-[-0.01em] mb-6">
            {t('title')} <br /><em className="italic font-normal text-gold-bright">{t('titleEmphasis')}</em>
          </h1>
          <p className="text-[17px] text-ivory/70 max-w-[580px] mx-auto mb-9 leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* DETAILED STEPS */}
      <section className="py-24">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="bg-white border border-line-light p-10 rounded-sm shadow-sm flex flex-col md:flex-row gap-8 items-start">
                <div className="font-serif italic text-[54px] text-gold leading-none shrink-0">{step.num}</div>
                <div>
                  <h3 className="text-[22px] font-serif font-medium mb-3 text-navy">{step.title}</h3>
                  <p className="text-[15px] text-ink/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/apply" className="bg-navy text-ivory px-8 py-4 text-[15px] font-semibold rounded-sm tracking-wide transition-all hover:bg-navy-deep inline-block">
              {t('startApplication')}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-deep text-ivory/50 py-10 border-t border-gold/10 text-[13px] text-center">
        <div className="max-w-[1180px] mx-auto px-8">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </main>
  );
}
