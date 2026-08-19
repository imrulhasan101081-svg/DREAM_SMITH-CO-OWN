import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';

export const metadata = {
  title: 'Dream Smith Chihno | Dream Smith Co-Own',
  description: 'A 10-storey residential & studio development at Oxoy More, Kazla. Reserve a 100 sq ft fractional share for ৳4,00,000 with a guaranteed ৳5,50,000 buy-back.',
};

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  // Hardcoded for 'chihno' as per SRS, dynamic data would come from MongoDB later.
  // Still 404 on any other slug so bad/old links don't silently render Chihno's content.
  if (params.slug !== 'chihno') {
    notFound();
  }

  const t = await getTranslations('ProjectDetail');

  return (
    <main className="min-h-screen bg-ivory">
      <Header />

      {/* PROJECT HERO */}
      <section className="bg-navy text-ivory pt-20 pb-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex items-center gap-4 text-gold-bright mb-6 text-[13px] font-mono tracking-wider">
            <Link href="/" className="hover:underline">{t('breadcrumb.home')}</Link>
            <span>/</span>
            <span>{t('breadcrumb.projects')}</span>
            <span>/</span>
            <span className="text-ivory/50">Chihno</span>
          </div>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-16 items-start mt-8">
            <div>
              <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('currentlyFunding')}</span>
              <h1 className="font-serif font-normal text-[clamp(36px,4vw,52px)] leading-[1.06] tracking-[-0.01em] mb-6">{t('titlePrefix')} <em className="italic text-gold">Chihno</em></h1>
              <p className="text-[17px] text-ivory/70 max-w-[580px] leading-relaxed mb-10">
                {t('description')}
              </p>
              <div className="aspect-video bg-navy-deep rounded-sm border border-gold/20 flex items-center justify-center mb-8 overflow-hidden relative shadow-2xl">
                <iframe
                  src="/animation.html"
                  className="absolute inset-0 w-full h-full border-0"
                  title={t('animationTitle')}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-gold/20 rounded-sm p-8">
              <h3 className="font-serif text-[22px] text-gold-bright mb-6">{t('investmentDetails')}</h3>

              <div className="flex flex-col">
                {[
                  { k: t('facts.sharePrice'), v: '৳4,00,000' },
                  { k: t('facts.shareSize'), v: '100 sq ft' },
                  { k: t('facts.maturity'), v: '36 Months' },
                  { k: t('facts.buybackValue'), v: '৳5,50,000' },
                  { k: t('facts.totalUnits'), v: '274' },
                ].map((fact, i) => (
                  <div key={i} className="flex justify-between items-baseline py-4 border-b border-gold/10">
                    <span className="text-[13.5px] text-ivory/60">{fact.k}</span>
                    <span className="font-serif text-[18px] text-ivory">{fact.v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-[12.5px] mb-2.5 font-mono text-ivory/60">
                  <span>{t('sharesReserved')}</span><span>176 / 274</span>
                </div>
                <div className="h-1.5 bg-ivory/10 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[64%] bg-gradient-to-r from-gold to-gold-bright rounded-full"></div>
                </div>
                <div className="text-center text-[12px] text-gold-bright font-mono mb-8">{t('sharesRemaining', { count: 98 })}</div>
              </div>

              <Link href="/apply" className="block text-center bg-gold text-navy-deep w-full py-4 text-[15px] font-semibold rounded-sm tracking-wide transition-all hover:bg-gold-bright">
                {t('reserveYourShare')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="bg-ivory py-24 border-b border-line">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('gallery.eyebrow')}</span>
              <h2 className="font-serif font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.15] tracking-[-0.01em] text-navy">{t('gallery.title')} <em className="italic text-gold">{t('gallery.titleEmphasis')}</em></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="aspect-[4/5] overflow-hidden rounded-sm group relative shadow-md">
              <Image src="/images/chinnoh/02b4d0f4-cb11-4f9e-a4bb-5c5bdd6098be.jpeg" alt="Chihno Project View" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-sm group relative shadow-md">
              <Image src="/images/chinnoh/1c025a0f-91e2-415b-9450-dafa6d595ac9.jpeg" alt="Chihno Interior" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-sm group relative shadow-md hidden lg:block">
              <Image src="/images/chinnoh/e7392cca-0ebe-46a2-b9fb-5b8ec178b8d2.jpeg" alt="Chihno Details" fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="aspect-[21/9] overflow-hidden rounded-sm group relative shadow-md">
              <Image src="/images/chinnoh/e928590c-a2d0-4b44-8b59-a1599be59f9f.jpeg" alt="Chihno Surroundings" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="aspect-[21/9] overflow-hidden rounded-sm group relative shadow-md">
              <Image src="/images/chinnoh/f7a916f5-d7b3-43ea-98d2-d21d022b6c80.jpeg" alt="Chihno Lifestyle" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT PROGRESS */}
      <section className="py-24">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('progress.eyebrow')}</span>
          <h2 className="font-serif font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.15] tracking-[-0.01em] mb-4">{t('progress.title')} <em className="italic text-gold">{t('progress.titleEmphasis')}</em></h2>
          <p className="text-ink/60 text-[16px] leading-relaxed mb-12">{t('progress.description')}</p>

          <div className="text-left bg-white border border-line-light p-8 rounded-sm shadow-sm relative">
            <div className="absolute top-8 right-8 bg-sage/10 text-sage px-3 py-1 text-[11px] font-mono rounded-sm">{t('progress.latest')}</div>
            <div className="font-mono text-[12px] text-ink/40 tracking-wider mb-2">12 AUGUST 2026</div>
            <h3 className="font-serif text-[20px] text-navy mb-4">Foundation Piling Commenced</h3>
            <div className="aspect-[21/9] bg-line-light rounded-sm mb-4 flex items-center justify-center overflow-hidden relative">
              <Image src="/images/chinnoh/fce73876-7692-4bbd-ba72-f2a5bfc0e915.jpeg" alt="Progress Photo" fill sizes="(max-width: 800px) 100vw, 800px" className="object-cover" />
            </div>
            <p className="text-[14px] text-ink/70 leading-relaxed">
              Site clearing is complete and the first phase of deep foundation piling has begun on the eastern block. Equipment is fully mobilized.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/progress/chihno" className="text-gold font-medium text-[14px] hover:underline">{t('progress.viewAll')}</Link>
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
