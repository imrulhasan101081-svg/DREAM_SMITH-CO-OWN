import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer id="contact" className="bg-navy-deep text-ivory/50 py-10 md:py-14 pb-6 md:pb-7 text-[13px]">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col text-ivory mb-5">
              <Link href="/" className="inline-block mb-3 transition-opacity hover:opacity-90">
                <Image
                  src="/images/logo/official-logo-full.png"
                  alt="Dream Smith Co-Own"
                  width={260}
                  height={65}
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </Link>
              <div className="pt-2.5 border-t border-gold/15 flex items-center gap-2 max-w-[280px]">
                <span className="font-mono text-[8.5px] tracking-widest uppercase text-ivory/45">PART OF THE</span>
                <span className="font-serif font-bold text-[14px] text-ivory">AZO</span>
                <span className="text-gold-bright font-mono text-[10px]">Platform</span>
              </div>
            </div>
            <p className="max-w-[280px] leading-relaxed text-[12.5px]">{t('tagline')}</p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold mb-4">{t('platform.title')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/#how" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('platform.howItWorks')}</Link>
              <Link href="/#project" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('platform.project')}</Link>
              <Link href="/#security" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('platform.security')}</Link>
              <Link href="/#cares" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('platform.cares')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold mb-4">{t('account.title')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/login" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('account.login')}</Link>
              <Link href="/verify" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('account.verify')}</Link>
              <Link href="/apply" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('account.apply')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold mb-4">{t('company.title')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/why-different" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('company.whyDifferent')}</Link>
              <Link href="/testimonials" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('company.testimonials')}</Link>
              <Link href="/contact" className="text-ivory/55 hover:text-gold-bright transition-colors">{t('company.contact')}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gold/15 pt-6 flex items-center justify-between flex-wrap gap-4 text-[12px]">
          <span>{t('copyright')}</span>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span>{t('location')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
