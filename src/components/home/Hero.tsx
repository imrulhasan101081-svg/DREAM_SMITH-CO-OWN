import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Parallax from '@/components/motion/Parallax';
import Reveal from '@/components/motion/Reveal';
import heroAerial from '../../../public/images/chihno/hero-aerial.jpg';

/**
 * Statically imported so Next derives intrinsic dimensions and a blur
 * placeholder at build time — the hero can't shift layout as it decodes.
 */
export default async function Hero({
  totalShares,
  reservedShares,
}: {
  totalShares: number;
  reservedShares: number;
}) {
  const t = await getTranslations('HomePage.hero');
  const remaining = Math.max(totalShares - reservedShares, 0);

  return (
    <section className="relative bg-navy-deep text-ivory overflow-hidden">
      {/* Plate */}
      <div className="absolute inset-0">
        <Parallax distance={110} scale={1.14} className="absolute inset-0">
          <Image
            src={heroAerial}
            alt="Aerial view of Dream Smith Chihno, Oxoy More, Kazla, Rajshahi"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
        </Parallax>

        {/* Scrim — weighted to the left so the headline always clears AA. */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/60" />
      </div>

      {/* Structural grid — hairline columns, drafting-sheet language. */}
      <div
        className="absolute inset-0 hidden md:grid grid-cols-12 max-w-[1320px] mx-auto px-10 pointer-events-none"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-l border-ivory/[0.05] last:border-r" />
        ))}
      </div>

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 pt-24 pb-16 md:pt-36 md:pb-20 min-h-[88vh] flex flex-col justify-end">
        <div className="max-w-[820px]">
          <Reveal y={16}>
            <div className="flex items-center gap-3.5 mb-8">
              <span className="w-10 h-px bg-gold" aria-hidden="true" />
              <span className="eyebrow text-gold-bright">{t('eyebrow')}</span>
            </div>
          </Reveal>

          <h1 className="font-serif font-normal text-[clamp(42px,7vw,86px)] leading-[0.98] tracking-[-0.025em] text-balance">
            <Reveal as="span" className="block" y={38} delay={60}>
              {t('titleLine1')}
            </Reveal>
            <Reveal as="span" className="block text-gold-bright" y={38} delay={160}>
              {t('titleLine2')}
            </Reveal>
          </h1>

          <Reveal delay={300} y={22}>
            <p className="mt-8 max-w-[560px] text-[16.5px] leading-[1.65] text-ivory/65">
              {t('subtitle')}
            </p>
          </Reveal>

          <Reveal delay={400} y={22}>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Link href="/apply" className="btn-gold px-8 py-4 text-[14px]">
                {t('reserveShare')}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/how-it-works" className="btn-outline px-8 py-4 text-[14px]">
                {t('seeHowItWorks')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Stat rail — hairline-separated, tabular figures. */}
        <div className="mt-16 md:mt-24 border-t border-ivory/15 pt-8">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {[
              { v: '৳4,00,000', k: t('statPricePerShare') },
              { v: '36', k: t('statTerm'), suffix: 'MO' },
              { v: '12.5%', k: t('statReturn') },
              { v: String(remaining), k: t('statRemaining') },
            ].map((stat, i) => (
              <Reveal
                key={stat.k}
                delay={120 * i}
                y={20}
                className={`py-4 md:py-0 md:px-8 first:md:pl-0 ${
                  i > 0 ? 'md:border-l border-ivory/15' : ''
                }`}
              >
                <dd className="font-serif text-[clamp(26px,3vw,38px)] leading-none text-gold-bright figures">
                  {stat.v}
                  {stat.suffix && (
                    <span className="font-mono text-[13px] ml-1.5 text-gold/70 align-top">
                      {stat.suffix}
                    </span>
                  )}
                </dd>
                <dt className="eyebrow text-[9.5px] text-ivory/45 mt-3">{stat.k}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
