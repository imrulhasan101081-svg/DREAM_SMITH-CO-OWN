'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KycToggle({ investorId, initialStatus }: { investorId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    setError('');
    const newStatus = status === 'pending' ? 'verified' : 'pending';

    try {
      const res = await fetch(`/api/admin/investors/${investorId}/kyc`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kyc_status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update KYC status.');
      }
    } catch (err) {
      setError('Network error — please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        title={error || undefined}
        className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-colors disabled:opacity-50 ${
          status === 'verified'
            ? 'bg-sage/10 text-sage hover:bg-sage/20'
            : 'bg-gold/10 text-gold hover:bg-gold/20'
        }`}
      >
        {status}
      </button>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
