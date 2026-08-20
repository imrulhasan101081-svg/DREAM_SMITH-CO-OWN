'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default function InvestorLoginPage() {
  const t = useTranslations('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        loginType: 'investor',
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own"
              width={220}
              height={50}
              priority
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-sm shadow-xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-[26px] text-navy mb-2">{t('title')}</h1>
            <p className="text-ink/60 text-[14px]">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}

            <div>
              <label className="block text-[13px] font-medium text-navy mb-2">{t('email')}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[15px]"
                disabled={isLoading}
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-navy mb-2">{t('password')}</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[15px]"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold text-navy-deep py-3.5 text-[15px] font-semibold rounded-sm mt-4 hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <p className="text-center text-[13px] text-ink/60 mt-8">
            {t('notInvestorYet')}{' '}
            <Link href="/apply" className="text-gold-bright font-medium hover:underline">
              {t('reserveShare')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
