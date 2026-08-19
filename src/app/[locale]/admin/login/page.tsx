'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        loginType: 'admin', // tell auth.ts to look in AdminUser, not Investor
      });

      if (result?.error) {
        setError('Invalid credentials or account deactivated.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own Admin"
              width={220}
              height={50}
              priority
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-sm shadow-xl p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] text-navy mb-2">Staff Portal</h1>
            <p className="text-ink/60 text-[14px]">Dream Smith Co-Own Administration</p>
          </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-line-light py-3.5 text-[15px] font-medium text-navy rounded-sm hover:bg-ivory/50 transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in as Super Admin
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line-light"></div>
            </div>
            <div className="relative flex justify-center text-[12px] uppercase tracking-widest text-ink/40 bg-white px-4">
              Or staff credentials
            </div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
            
            <div>
              <label className="block text-[13px] font-medium text-navy mb-2">Staff Email</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[15px]" 
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-navy mb-2">Password</label>
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
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
