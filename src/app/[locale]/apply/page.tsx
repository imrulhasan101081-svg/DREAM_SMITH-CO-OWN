'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function ApplyPage() {
  const t = useTranslations('Apply');
  const [shares, setShares] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nid: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const pricePerShare = 400000;
  const totalValue = shares * pricePerShare;

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, shares }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md border-b border-line">
        <nav className="flex items-center justify-between px-6 md:px-8 py-2.5 max-w-[1180px] mx-auto">
          <Link href="/" className="flex items-center gap-3 shrink-0 py-1 transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own"
              width={260}
              height={70}
              priority
              className="h-12 md:h-15 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/" className="text-ivory/60 text-[13.5px] hover:text-ivory transition-colors">
              {t('cancelReturnHome')}
            </Link>
          </div>
        </nav>
      </header>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 md:px-8">
          {submitted ? (
            <div className="bg-white border border-sage/30 rounded-sm p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
              <h2 className="font-serif text-[32px] text-navy mb-4">{t('successTitle')}</h2>
              <p className="text-ink/70 text-[16px] leading-relaxed mb-8">
                {t('successMessage', { name: formData.name, shares, phone: formData.phone })}
              </p>
              <Link href="/" className="bg-navy text-ivory px-8 py-3.5 text-[14.5px] font-medium rounded-sm inline-block hover:bg-navy-deep">
                {t('returnHome')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-line-light p-6 sm:p-8 md:p-10 rounded-sm shadow-sm">
              <span className="font-mono text-[12px] tracking-[0.14em] text-gold uppercase mb-2 block">{t('stepLabel')}</span>
              <h1 className="font-serif text-[36px] text-navy mb-8">{t('title')}</h1>

              <div className="mb-10">
                <label className="block font-medium text-[15px] text-navy mb-4">{t('sharesQuestion')}</label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-line-light rounded-sm">
                    <button type="button" onClick={() => setShares(Math.max(1, shares - 1))} className="px-5 py-3 text-xl text-ink hover:bg-ivory-dim transition-colors">−</button>
                    <div className="px-6 py-3 border-x border-line-light font-mono text-[18px] w-20 text-center">{shares}</div>
                    <button type="button" onClick={() => setShares(Math.min(10, shares + 1))} className="px-5 py-3 text-xl text-ink hover:bg-ivory-dim transition-colors">+</button>
                  </div>
                  <div>
                    <div className="text-[12px] text-ink/50 font-mono tracking-widest uppercase mb-1">{t('totalInvestment')}</div>
                    <div className="font-serif text-[24px] text-navy">৳{totalValue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 text-[13px] text-ink/50">{t('shareNote')}</div>
              </div>

              <hr className="border-line-light mb-10" />

              <div className="mb-8 space-y-6">
                <h3 className="font-serif text-[22px] text-navy">{t('investorDetails')}</h3>

                <div>
                  <label className="block text-[13px] font-medium text-navy mb-2">{t('fullName')}</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[15px]" placeholder={t('fullNamePlaceholder')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-navy mb-2">{t('mobileNumber')}</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[15px]" placeholder={t('mobileNumberPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-navy mb-2">{t('emailAddress')}</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[15px]" placeholder={t('emailPlaceholder')} />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-navy mb-2">{t('nidNumber')}</label>
                  <input required type="text" value={formData.nid} onChange={(e) => setFormData({...formData, nid: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[15px]" placeholder={t('nidPlaceholder')} />
                </div>
              </div>

              <div className="bg-ivory p-6 rounded-sm mb-8 text-[13px] text-ink/70 leading-relaxed">
                {t('disclaimer', { shares })}
              </div>

              {error && <div className="mb-6 text-red-600 bg-red-50 p-4 border border-red-200 rounded-sm text-[14px]">{error}</div>}

              <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-navy-deep py-4 text-[15px] font-semibold rounded-sm tracking-wide transition-all hover:bg-gold-bright disabled:opacity-50">
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
