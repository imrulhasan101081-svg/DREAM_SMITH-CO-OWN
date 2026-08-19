import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import TrackRecord from '@/components/home/TrackRecord';
import Reveal from '@/components/motion/Reveal';
import Parallax from '@/components/motion/Parallax';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import Application from '@/lib/models/Application';
import tower from '../../../public/images/chihno/tower.jpg';
import entrance from '../../../public/images/chihno/entrance.jpg';
import detail from '../../../public/images/chihno/detail.jpg';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dream Smith Co-Own | Fractional Co-Ownership in Rajshahi',
  description:
    'Co-own 100 sq. ft. of Dream Smith Chihno for ৳4,00,000 — fully documented, notarized, and backed by a bank-secured buy-back.',
};

export default async function Home() {
  const t = await getTranslations('HomePage');

  let totalShares = 274;
  let reservedShares = 0;
  let project: any = null;

  try {
    await dbConnect();
    project =
      (await Project.findOne({ slug: 'chihno' }).lean()) ||
      (await Project.findOne().lean());

    if (project) {
      totalShares = project.total_shares || 274;
      const apps = await Application.find({
        project_id: project._id,
        status: { $in: ['new', 'converted'] },
      }).lean();
      reservedShares = apps.reduce(
        (sum: number, app: any) => sum + (app.shares_requested || 0),
        0
      );
    }
  } catch (dbErr) {
    console.warn('DB connection warning on homepage:', dbErr);
  }

  const pct = Math.min(100, Math.round((reservedShares / totalShares) * 100));

  return (
    <>
      <Header />

      <Hero totalShares={totalShares} reservedShares={reservedShares} />

      {/* ── THE MODEL ────────────────────────────────────────────────────── */}
      <section id="how" className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-20 mb-14 md:mb-20 items-end">
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-8 h-px bg-gold" aria-hidden="true" />
                  <span className="eyebrow text-gold">{t('howItWorks.eyebrow')}</span>
                </div>
                <h2 className="font-serif font-normal text-[clamp(30px,4vw,50px)] leading-[1.05] tracking-[-0.022em] text-navy text-balance">
                  {t.rich('howItWorks.title', {
                    em: (chunks) => <em className="italic text-gold">{chunks}</em>,
                  })}
                  <br />
                  {t('howItWorks.titleLine2')}
                </h2>
              </div>
              <p className="text-ink/60 text-[16px] leading-[1.7] max-w-[520px] md:pb-2">
                {t('howItWorks.description')}
              </p>
            </div>
          </Reveal>

          <div className="rule-grid md:grid-cols-4">
            {(['step1', 'step2', 'step3', 'step4'] as const).map((step, i) => (
              <Reveal key={step} delay={i * 110} y={26} className="bg-ivory">
                <div className="p-8 md:p-9 h-full group transition-colors duration-500 hover:bg-white">
                  <div className="flex items-baseline justify-between mb-7">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="w-6 h-px bg-gold/30 transition-all duration-500 group-hover:w-10 group-hover:bg-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-serif text-[19px] leading-tight text-navy mb-3 tracking-[-0.01em]">
                    {t(`howItWorks.steps.${step}.title`)}
                  </h3>
                  <p className="text-[13.5px] text-ink/60 leading-[1.7]">
                    {t(`howItWorks.steps.${step}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTMENT STRUCTURE ─────────────────────────────────────────── */}
      <section id="structure" className="bg-navy-deep text-ivory py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3.5 mb-6">
              <span className="w-8 h-px bg-gold" aria-hidden="true" />
              <span className="eyebrow text-gold-bright">{t('returns.eyebrow')}</span>
            </div>
            <h2 className="font-serif font-normal text-[clamp(30px,4vw,50px)] leading-[1.05] tracking-[-0.022em] mb-4 text-balance">
              {t('returns.title')}{' '}
              <em className="italic text-gold-bright">{t('returns.titleEmphasis')}</em>
            </h2>
            <p className="text-ivory/55 text-[16px] leading-[1.7] max-w-[560px]">
              {t('returns.description')}
            </p>
          </Reveal>

          {/* The ladder — one share, start to finish. */}
          <div className="mt-14 md:mt-18 rule-grid-dark md:grid-cols-3">
            {[
              {
                k: t('returns.yourInvestment'),
                v: '৳4,00,000',
                d: t('returns.investmentDetail'),
                accent: false,
              },
              {
                k: t('returns.termLabel'),
                v: t('returns.termDetail'),
                d: t('returns.termSubdetail'),
                accent: false,
              },
              {
                k: t('returns.buybackReturn'),
                v: '৳5,50,000',
                d: t('returns.buybackDetail'),
                accent: true,
              },
            ].map((col, i) => (
              <Reveal key={col.k} delay={i * 130} y={26} className="bg-navy">
                <div className="corner-ticks p-8 md:p-10 h-full">
                  <div className="eyebrow text-[9.5px] text-ivory/40 mb-6">{col.k}</div>
                  <div
                    className={`font-serif text-[clamp(32px,4vw,46px)] leading-none tracking-[-0.02em] figures ${
                      col.accent ? 'text-gold-bright' : 'text-ivory'
                    }`}
                  >
                    {col.v}
                  </div>
                  <div className="text-[13px] text-ivory/45 mt-4 leading-relaxed">{col.d}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="eyebrow text-[9.5px] text-gold/70 mt-6 leading-relaxed max-w-[640px]">
              {t('returns.securedNote')}
            </p>
          </Reveal>

          {/* Allocation meter */}
          <Reveal delay={80}>
            <div className="mt-14 md:mt-18 border border-gold/20 p-8 md:p-10">
              <div className="flex flex-wrap items-end justify-between gap-6 mb-7">
                <div>
                  <div className="eyebrow text-[9.5px] text-ivory/40 mb-3">
                    {t('project.sharesReserved')}
                  </div>
                  <div className="font-serif text-[30px] leading-none text-ivory figures">
                    {reservedShares}
                    <span className="text-ivory/30"> / {totalShares}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="eyebrow text-[9.5px] text-ivory/40 mb-3">
                    {t('structure.totalRaise')}
                  </div>
                  <div className="font-serif text-[30px] leading-none text-gold-bright figures">
                    ৳{((totalShares * 400000) / 10000000).toFixed(2)} Cr
                  </div>
                </div>
              </div>

              {/* Ticked meter — reads as a gauge, not a progress bar. */}
              <div
                className="relative h-8 border border-gold/25"
                role="img"
                aria-label={`${reservedShares} of ${totalShares} shares reserved`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gold/85 transition-[width] duration-1000"
                  style={{ width: `${pct}%` }}
                />
                <div className="absolute inset-0 flex" aria-hidden="true">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex-1 border-r border-navy-deep/35 last:border-r-0" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between eyebrow text-[9px] text-ivory/35 mt-3">
                <span>0</span>
                <span>{totalShares} {t('structure.sharesUnit')}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ─────────────────────────────────────────────── */}
      <section id="project" className="bg-ivory py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid md:grid-cols-[minmax(0,380px)_1fr] gap-10 md:gap-20 items-end mb-14 md:mb-18">
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-8 h-px bg-gold" aria-hidden="true" />
                  <span className="eyebrow text-gold">{t('project.eyebrow')}</span>
                </div>
                <h2 className="font-serif font-normal text-[clamp(30px,4vw,50px)] leading-[1.05] tracking-[-0.022em] text-navy">
                  {t('project.titlePrefix')}{' '}
                  <em className="italic text-gold">Chihno</em>
                </h2>
              </div>
              <p className="text-ink/60 text-[16px] leading-[1.7] max-w-[520px] md:pb-2">
                {t('project.description')}
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-12 gap-5 md:gap-6">
            {/* Tall elevation */}
            <Reveal className="md:col-span-5" y={34} scale={1.02}>
              <figure className="media-frame corner-ticks border border-line-light">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={tower}
                    alt="Dream Smith Chihno — street elevation"
                    fill
                    placeholder="blur"
                    sizes="(max-width: 768px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </Reveal>

            <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
              {/* Wide entrance shot with parallax */}
              <Reveal y={34} scale={1.02}>
                <figure className="media-frame corner-ticks border border-line-light">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Parallax distance={44} scale={1.1} className="absolute inset-0">
                      <Image
                        src={entrance}
                        alt="Dream Smith Chihno — entrance and street frontage"
                        fill
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-cover"
                      />
                    </Parallax>
                  </div>
                </figure>
              </Reveal>

              {/* Spec table */}
              <Reveal delay={100} className="flex-1">
                <div className="border border-line-light h-full">
                  <dl className="divide-y divide-line-light">
                    {[
                      { k: t('project.facts.location'), v: project?.location || 'Oxoy More, Kazla, Rajshahi' },
                      { k: t('project.facts.structure'), v: project?.structure_details || '10 floors' },
                      {
                        k: t('project.facts.constructionPeriod'),
                        v: t('project.facts.months', { months: project?.construction_months || 30 }),
                      },
                      { k: t('project.facts.totalShares'), v: t('project.facts.units', { count: totalShares }) },
                      {
                        k: t('project.facts.firstRefusalRate'),
                        v: t('project.facts.perSqFt', {
                          amount: `৳${(project?.first_refusal_rate || 5500).toLocaleString()}`,
                        }),
                      },
                    ].map((f) => (
                      <div key={f.k} className="flex items-baseline justify-between gap-6 px-6 py-4">
                        <dt className="text-[13px] text-ink/50">{f.k}</dt>
                        <dd className="font-serif text-[16px] text-navy text-right figures">{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={80}>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/apply" className="btn-gold px-8 py-4 text-[14px]">
                {t('project.reserveShareIn', { project: project?.name || 'Chihno' })}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/security" className="btn-outline-ink px-8 py-4 text-[14px]">
                {t('project.viewLegalDocuments')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <TrackRecord />

      {/* ── INVESTOR PROTECTION ──────────────────────────────────────────── */}
      <section id="security" className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid md:grid-cols-[minmax(0,380px)_1fr] gap-10 md:gap-20 items-end mb-14 md:mb-18">
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-8 h-px bg-gold" aria-hidden="true" />
                  <span className="eyebrow text-gold">{t('security.eyebrow')}</span>
                </div>
                <h2 className="font-serif font-normal text-[clamp(30px,4vw,50px)] leading-[1.05] tracking-[-0.022em] text-navy text-balance">
                  {t('security.title')}{' '}
                  <em className="italic text-gold">{t('security.titleEmphasis')}</em>
                </h2>
              </div>
              <p className="text-ink/60 text-[16px] leading-[1.7] max-w-[520px] md:pb-2">
                {t('security.description')}
              </p>
            </div>
          </Reveal>

          <div className="rule-grid md:grid-cols-2">
            {(['agreement', 'cheque', 'title_', 'certificate'] as const).map((item, i) => (
              <Reveal key={item} delay={i * 110} y={26} className="bg-ivory">
                <div className="group flex gap-6 p-8 md:p-10 h-full transition-colors duration-500 hover:bg-white">
                  <span
                    className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-gold pt-1"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-[19px] leading-tight text-navy mb-3 tracking-[-0.01em]">
                      {t(`security.items.${item}.title`)}
                    </h3>
                    <p className="text-[13.5px] text-ink/60 leading-[1.7]">
                      {t(`security.items.${item}.desc`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AZO CARES ────────────────────────────────────────────────────── */}
      <section id="cares" className="bg-sage-dim py-20 md:py-24 border-y border-sage/20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 border border-sage/40 text-sage eyebrow text-[9.5px] px-3 py-1.5 mb-7">
                <span className="w-1 h-1 bg-sage" aria-hidden="true" />
                {t('cares.badge')}
              </div>
              <h2 className="font-serif font-normal text-[clamp(28px,3.4vw,42px)] leading-[1.08] tracking-[-0.02em] text-navy mb-5 text-balance">
                {t('cares.title')} <em className="italic text-sage">{t('cares.titleEmphasis')}</em>
              </h2>
              <p className="text-ink/60 text-[15.5px] leading-[1.7] mb-8">{t('cares.description')}</p>
              <Link href="/cares" className="btn-outline-ink px-7 py-3.5 text-[14px]">
                {t('cares.seeFullReport')}
              </Link>
            </Reveal>

            <Reveal delay={140} y={26}>
              <div className="bg-white border border-sage/25">
                <div className="flex items-center justify-between px-7 py-4 border-b border-sage/20">
                  <span className="eyebrow text-[9.5px] text-sage">{t('cares.liveTotal')}</span>
                  <span className="eyebrow text-[9.5px] text-ink/35">{t('cares.ytd')}</span>
                </div>
                <div className="px-7 py-8 border-b border-sage/20">
                  <div className="font-serif text-[clamp(34px,4vw,46px)] leading-none text-sage figures">
                    ৳2,84,600
                  </div>
                  <div className="text-[13px] text-ink/50 mt-3">{t('cares.contributedToDate')}</div>
                </div>
                <dl className="divide-y divide-sage/15">
                  {[
                    { k: t('cares.scholarships'), v: '৳1,10,000' },
                    { k: t('cares.medicalFund'), v: '৳94,600' },
                    { k: t('cares.reliefPrograms'), v: '৳80,000' },
                  ].map((row) => (
                    <div key={row.k} className="flex justify-between gap-4 px-7 py-3.5">
                      <dt className="text-[13px] text-ink/60">{row.k}</dt>
                      <dd className="font-mono text-[13px] text-sage figures">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <div className="bg-navy">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {(['since2011', 'rjsc', 'notarized', 'location'] as const).map((item, i) => (
              <Reveal
                key={item}
                delay={i * 90}
                y={18}
                className={`py-4 md:py-0 md:px-8 first:md:pl-0 ${
                  i > 0 ? 'md:border-l border-gold/20' : ''
                }`}
              >
                <b className="block font-serif text-[16px] text-gold-bright mb-2 font-normal">
                  {t(`trustStrip.${item}.b`)}
                </b>
                <span className="eyebrow text-[9px] text-ivory/40">{t(`trustStrip.${item}.s`)}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLOSING ──────────────────────────────────────────────────────── */}
      <section id="apply" className="relative bg-navy-deep text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Parallax distance={70} scale={1.12} className="absolute inset-0">
            <Image
              src={detail}
              alt=""
              aria-hidden="true"
              fill
              placeholder="blur"
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-deep/80 to-navy-deep" />
        </div>

        <div className="relative max-w-[820px] mx-auto px-6 md:px-10 py-24 md:py-32 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-gold" aria-hidden="true" />
              <span className="eyebrow text-gold-bright">{t('cta.eyebrow')}</span>
              <span className="w-8 h-px bg-gold" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="font-serif font-normal text-[clamp(32px,4.6vw,58px)] leading-[1.03] tracking-[-0.025em] text-balance">
              {t('cta.title', {
                count: Math.max(totalShares - reservedShares, 0),
                project: project?.name || 'Chihno',
              })}
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p className="text-ivory/60 text-[16px] leading-[1.7] max-w-[520px] mx-auto mt-7">
              {t('cta.description')}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-11 flex flex-wrap gap-3.5 justify-center">
              <Link href="/apply" className="btn-gold px-9 py-4 text-[14.5px]">
                {t('cta.startApplication')}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/portal" className="btn-outline px-9 py-4 text-[14.5px]">
                {t('cta.investorPortal')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
