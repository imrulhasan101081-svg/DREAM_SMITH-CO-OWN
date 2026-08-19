'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function VerifyPage({ params }: { params: { certificateId?: string[] } }) {
  const t = useTranslations('Verify');
  const initialCertId = params.certificateId?.[0] || '';
  const [certId, setCertId] = useState(initialCertId);
  const [verified, setVerified] = useState<boolean | null>(initialCertId ? true : null);
  const [certData, setCertData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If URL has cert hash, auto verify on mount
  useEffect(() => {
    if (initialCertId) {
      verifyHash(initialCertId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyHash = async (hash: string) => {
    setIsLoading(true);
    setVerified(null);
    setCertData(null);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/verify/${hash}`);
      const data = await res.json();

      if (res.ok) {
        setVerified(true);
        setCertData(data.data);
      } else {
        setVerified(false);
        setErrorMsg(data.error || t('notFoundTitle'));
      }
    } catch (err) {
      setVerified(false);
      setErrorMsg(t('connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim().length > 0) {
      verifyHash(certId.trim());
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
              width={200}
              height={48}
              priority
              className="h-10 md:h-11 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/" className="text-ivory/60 text-[13.5px] hover:text-ivory transition-colors">
              {t('returnToMain')}
            </Link>
          </div>
        </nav>
      </header>

      <section className="py-24">
        <div className="max-w-[700px] mx-auto px-8">

          <div className="text-center mb-10">
            <span className="font-mono text-[12px] tracking-[0.14em] text-gold uppercase mb-4 block">{t('eyebrow')}</span>
            <h1 className="font-serif text-[36px] text-navy mb-4">{t('title')}</h1>
            <p className="text-[15px] text-ink/70">{t('description')}</p>
          </div>

          <div className="bg-white border border-line-light p-10 rounded-sm shadow-sm mb-12">
            <form onSubmit={handleVerify} className="flex gap-4">
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="flex-1 border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors font-mono text-[14px]"
              />
              <button type="submit" disabled={isLoading} className="bg-navy text-ivory px-8 py-3 font-medium rounded-sm transition-all hover:bg-navy-deep disabled:opacity-50">
                {isLoading ? t('verifying') : t('verify')}
              </button>
            </form>
          </div>

          {verified === true && (
            <div className="bg-navy p-10 rounded-sm text-ivory relative overflow-hidden shadow-lg border border-gold/20">
              <div className="absolute top-6 right-6 bg-sage text-white px-3 py-1 text-[11px] font-mono rounded-sm tracking-widest">● {t('authentic')}</div>

              <div className="mb-8">
                <div className="font-mono text-[11px] text-gold-bright tracking-widest uppercase mb-1">{t('certificateNumber')}</div>
                <div className="font-mono text-[18px]">{certData?.certificate_id}</div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8 border-b border-gold/10 pb-8">
                <div>
                  <div className="font-mono text-[10px] text-ivory/40 tracking-widest uppercase mb-1">{t('holderName')}</div>
                  <div className="font-serif text-[18px]">{certData?.investor_name}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-ivory/40 tracking-widest uppercase mb-1">{t('project')}</div>
                  <div className="font-serif text-[18px]">{certData?.project_name}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-ivory/40 tracking-widest uppercase mb-1">{t('shareVolume')}</div>
                  <div className="font-serif text-[18px]">{t('units', { count: certData?.share_count ?? 0 })}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-ivory/40 tracking-widest uppercase mb-1">{t('maturityDate')}</div>
                  <div className="font-serif text-[18px]">
                    {certData?.maturity_date ? new Date(certData.maturity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : t('notAvailable')}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="font-mono text-[10px] text-ivory/40 tracking-widest uppercase mb-1">{t('status')}</div>
                  <div className="text-[14px] text-sage">{certData?.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-gold tracking-widest uppercase mb-1">{t('guaranteedBuyback')}</div>
                  <div className="font-serif text-[24px] text-gold-bright">৳{certData?.buyback?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {verified === false && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-sm text-center">
              <div className="text-[32px] mb-2">⚠</div>
              <h3 className="font-serif text-[20px] mb-2">{t('notFoundTitle')}</h3>
              <p className="text-[14px] opacity-80">{errorMsg}</p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
