'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton({ callbackUrl = '/admin/login' }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className="w-full text-left px-4 py-2.5 rounded-sm hover:bg-white/5 transition-colors text-gold/80 hover:text-gold"
    >
      Sign Out
    </button>
  );
}
