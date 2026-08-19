import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Investor Testimonials | Dream Smith Co-Own',
  description: 'Hear from early investors who have secured fractional shares in Dream Smith projects.',
};

export default async function TestimonialsPage() {
  const t = await getTranslations('Testimonials');

  const testimonials = [
    { key: 't1', name: 'Tariqul Islam', date: 'March 2026' },
    { key: 't2', name: 'Dr. Farhana Ahmed', date: 'February 2026' },
    { key: 't3', name: 'Md. Shafiqur Rahman', date: 'January 2026' },
    { key: 't4', name: 'Kamrul Hasan', date: 'April 2026' },
    { key: 't5', name: 'Nusrat Jahan', date: 'May 2026' },
  ];

  return (
    <>
      <Header />

      <main className="pt-32 pb-24 min-h-screen bg-ivory">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[800px] mb-16">
            <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('eyebrow')}</span>
            <h1 className="font-serif font-normal text-[clamp(32px,4vw,48px)] leading-[1.15] tracking-[-0.01em] mb-6 text-navy">
              {t('title')} <em className="italic text-gold">{t('titleEmphasis')}</em>
            </h1>
            <p className="text-[17px] text-ink/70 leading-relaxed mb-8">
              {t('description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.key} className="bg-white border border-line-light p-8 rounded-sm shadow-sm flex flex-col">
                <div className="text-gold font-serif text-[40px] leading-none mb-4">&quot;</div>
                <p className="text-[14.5px] text-ink/80 leading-relaxed mb-8 flex-1 italic">
                  {t(`items.${testimonial.key}.quote`)}
                </p>
                <div className="border-t border-line-light pt-4 mt-auto">
                  <div className="font-serif text-[16px] text-navy mb-1">{testimonial.name}</div>
                  <div className="text-[11px] font-mono text-ink/50 uppercase tracking-wide">{t(`items.${testimonial.key}.role`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
