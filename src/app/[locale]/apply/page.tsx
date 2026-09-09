'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import Footer from '@/components/Footer';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          share_count: shares,
          applicant_name: formData.name,
          applicant_phone: formData.phone,
          applicant_email: formData.email,
          nid_number: formData.nid,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t('submissionFailed'));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                className="h-12 md:h-14 w-auto object-contain"
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
              <div className="bg-white border border-line-light p-8 sm:p-12 text-center shadow-lg rounded-sm">
                <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  ✓
                </div>
                <h1 className="font-serif text-[32px] text-navy mb-4">{t('applicationReceived')}</h1>
                <p className="text-[16px] text-ink/70 mb-8 max-w-[500px] mx-auto leading-relaxed">
                  {t('applicationSuccessMsg', { name: formData.name, shares })}
                </p>
                <Link href="/" className="btn-gold px-8 py-3.5 text-[14px]">
                  {t('returnToHomepage')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-line-light p-6 sm:p-10 md:p-12 shadow-sm rounded-sm">
                <div className="text-center mb-10">
                  <span className="eyebrow text-[12px] tracking-[0.2em] text-gold uppercase mb-3 block font-bold">{t('eyebrow')}</span>
                  <h1 className="font-serif text-[32px] sm:text-[40px] text-navy mb-3">{t('title')}</h1>
                  <p className="text-[15px] text-ink/70">{t('subtitle')}</p>
                </div>

                <div className="mb-10 pb-8 border-b border-line-light">
                  <label className="block text-[13px] font-mono tracking-widest text-ink/60 uppercase mb-4">
                    {t('selectSharesLabel')}
                  </label>
                  <div className="flex items-center gap-6 mb-4">
                    <button
                      type="button"
                      onClick={() => setShares(Math.max(1, shares - 1))}
                      className="w-12 h-12 border border-line-light flex items-center justify-center text-xl text-navy hover:border-gold transition-colors rounded-sm"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center bg-ivory py-3 border border-line-light rounded-sm">
                      <span className="font-serif text-[28px] text-navy font-bold">{shares}</span>
                      <span className="text-[13px] text-ink/60 block font-mono">
                        {t('shareUnits', { count: shares, sqft: shares * 100 })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShares(shares + 1)}
                      className="w-12 h-12 border border-line-light flex items-center justify-center text-xl text-navy hover:border-gold transition-colors rounded-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-[13px] text-navy font-medium px-1">
                    <span>{t('totalInvestment')} ৳{(shares * 400000).toLocaleString()}</span>
                    <span>{t('maturityBuyback')} ৳{(shares * 550000).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <h3 className="font-serif text-[22px] text-navy">{t('investorDetails')}</h3>

                  <div>
                    <label className="block text-[13px] font-medium text-navy mb-2">{t('fullName')}</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[16px] sm:text-[15px]" placeholder={t('fullNamePlaceholder')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[13px] font-medium text-navy mb-2">{t('mobileNumber')}</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[16px] sm:text-[15px]" placeholder={t('mobileNumberPlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-navy mb-2">{t('emailAddress')}</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[16px] sm:text-[15px]" placeholder={t('emailPlaceholder')} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-navy mb-2">{t('nidNumber')}</label>
                    <input required type="text" value={formData.nid} onChange={(e) => setFormData({...formData, nid: e.target.value})} className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors text-[16px] sm:text-[15px]" placeholder={t('nidPlaceholder')} />
                  </div>
                </div>

                <div className="bg-ivory p-6 rounded-sm mb-8 text-[13px] text-ink/70 leading-relaxed">
                  {t('disclaimer', { shares })}
                </div>

                {error && <div className="mb-6 text-red-600 bg-red-50 p-4 border border-red-200 rounded-sm text-[14px]">{error}</div>}

                <button type="submit" disabled={isSubmitting} className="w-full btn-gold py-4 text-[15px] font-semibold tracking-wide disabled:opacity-50">
                  {isSubmitting ? t('submitting') : t('submit')}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
