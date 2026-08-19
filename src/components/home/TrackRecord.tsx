import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/motion/Reveal';
import maya from '../../../public/images/track-record/maya.jpg';
import malancho from '../../../public/images/track-record/malancho.jpg';

/**
 * Quiet trust-building, not a portfolio. Two delivered buildings, stated
 * plainly and kept deliberately small so Chihno stays the page's subject.
 */
export default async function TrackRecord() {
  const t = await getTranslations('HomePage.ourLegacy');

  const built = [
    { img: maya, name: 'Maya', meta: t('maya'), alt: 'Maya by Dream Smith Properties' },
    { img: malancho, name: 'Malancho Kotha', meta: t('malancho'), alt: 'Malancho Kotha by Dream Smith Properties' },
  ];

  return (
    <section className="bg-navy text-ivory border-y border-gold/15">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid md:grid-cols-[minmax(0,300px)_1fr] gap-12 md:gap-20 items-start">
          <Reveal>
            <div className="flex items-center gap-3.5 mb-6">
              <span className="w-8 h-px bg-gold" aria-hidden="true" />
              <span className="eyebrow text-gold-bright">{t('eyebrow')}</span>
            </div>
            <p className="font-serif text-[24px] leading-[1.25] tracking-[-0.015em] text-ivory/90">
              {t('lede')}
            </p>
            <p className="mt-5 text-[14px] leading-relaxed text-ivory/50">{t('note')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-px bg-gold/20 border border-gold/20">
            {built.map((b, i) => (
              <Reveal key={b.name} delay={i * 130} y={24} className="bg-navy">
                <figure className="media-frame group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={b.img}
                      alt={b.alt}
                      fill
                      placeholder="blur"
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-4 px-5 py-4 border-t border-gold/20">
                    <span className="font-serif text-[17px] text-ivory">{b.name}</span>
                    <span className="eyebrow text-[9px] text-gold-bright/80">{b.meta}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
