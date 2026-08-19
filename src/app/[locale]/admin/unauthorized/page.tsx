import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-10 text-center">
        <div className="w-16 h-16 border-2 border-red-500 mx-auto flex items-center justify-center rounded-full text-[24px] text-red-500 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-serif text-[28px] text-navy mb-2">Access Denied</h1>
        <p className="text-ink/60 text-[14px] mb-8">
          You do not have permission to access the administration portal, or your account has been deactivated.
        </p>

        <div className="space-y-4">
          <Link href="/admin/login" className="block w-full bg-navy text-ivory py-3 text-[14px] font-medium rounded-sm hover:bg-navy-light transition-colors">
            Return to Login
          </Link>
          <Link href="/" className="block w-full border border-line-light text-navy py-3 text-[14px] font-medium rounded-sm hover:bg-ivory/50 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
