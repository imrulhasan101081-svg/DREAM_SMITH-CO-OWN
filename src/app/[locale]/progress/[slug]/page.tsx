import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';

export const metadata = {
  title: 'Construction Progress | Dream Smith Co-Own',
  description: 'Track the physical progress of Dream Smith Chihno with dated, authenticated photo updates posted directly from the site.',
};

export default async function ProgressPage({ params }: { params: { slug: string } }) {
  // Hardcoded updates for now — still 404 on any other slug so bad/old
  // links don't silently render Chihno's progress feed.
  if (params.slug !== 'chihno') {
    notFound();
  }

  const t = await getTranslations('Progress');

  const updates = [
    {
      date: '12 AUGUST 2026',
      title: 'Foundation Piling Commenced',
      desc: 'Site clearing is complete and the first phase of deep foundation piling has begun on the eastern block. Equipment is fully mobilized.',
      phase: 'Foundation'
    },
    {
      date: '25 JULY 2026',
      title: 'Site Preparation & Hoarding',
      desc: 'Boundary hoarding is complete. Soil testing engineers have submitted the final bearing capacity report.',
      phase: 'Preparation'
    }
  ];

  return (
    <main className="min-h-screen bg-ivory">
      <Header />

      <section className="pt-20 pb-12 bg-navy text-ivory">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <span className="font-mono text-[12px] tracking-[0.14em] text-gold-bright uppercase mb-4 block">{t('eyebrow')}</span>
          <h1 className="font-serif font-normal text-[clamp(32px,3.5vw,44px)] leading-[1.1] tracking-[-0.01em] mb-4">
            {t('title')} <em className="italic text-gold">{t('titleEmphasis')}</em>
          </h1>
          <p className="text-ivory/70 text-[16px]">{t('projectLabel')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="space-y-10 border-l border-gold/30 ml-4 pl-8 py-2">
            {updates.map((update, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-1 w-[18px] h-[18px] bg-ivory border-2 border-gold rounded-full"></div>
                <div className="bg-white border border-line-light p-8 rounded-sm shadow-sm relative">
                  {i === 0 && (
                    <div className="absolute top-8 right-8 bg-sage/10 text-sage px-3 py-1 text-[11px] font-mono rounded-sm">{t('latest')}</div>
                  )}
                  <div className="flex gap-3 items-center mb-3">
                    <div className="font-mono text-[12px] text-ink/40 tracking-wider">{update.date}</div>
                    <div className="text-[10px] font-mono bg-navy/5 text-navy px-2 py-0.5 rounded-sm uppercase tracking-wide">{update.phase}</div>
                  </div>

                  <h3 className="font-serif text-[20px] text-navy mb-4">{update.title}</h3>
                  <div className="aspect-[21/9] bg-line-light rounded-sm mb-4 flex items-center justify-center">
                    <span className="font-mono text-[11px] text-ink/30 tracking-widest">{t('photoPlaceholder')}</span>
                  </div>
                  <p className="text-[14px] text-ink/70 leading-relaxed">
                    {update.desc}
                  </p>
                </div>
              </div>
            ))}
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
