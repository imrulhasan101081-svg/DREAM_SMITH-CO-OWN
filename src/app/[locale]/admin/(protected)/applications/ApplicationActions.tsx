'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplicationActions({ 
  applicationId, 
  status,
  applicantName,
  sharesRequested
}: { 
  applicationId: string, 
  status: string,
  applicantName: string,
  sharesRequested: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementRef, setAgreementRef] = useState('');
  const [chequeRef, setChequeRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (status === 'converted') {
    return <span className="text-[12px] text-sage font-mono uppercase tracking-widest bg-sage/10 px-3 py-1.5 rounded-sm">Converted</span>;
  }

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreementRef, chequeRef }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to convert');
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-[12px] font-medium bg-gold text-navy-deep px-4 py-2 rounded-sm hover:bg-gold-bright transition-colors"
      >
        Convert to Holding
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg p-8 shadow-xl">
            <h2 className="font-serif text-[24px] text-navy mb-2">Convert Application</h2>
            <p className="text-[14px] text-ink/70 mb-6">
              Confirming conversion for <b>{applicantName}</b> ({sharesRequested} shares). This will permanently reserve the shares and create the Investor account.
            </p>

            <form onSubmit={handleConvert} className="space-y-4">
              {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
              
              <div>
                <label className="block text-[13px] font-medium text-navy mb-2">Signed Agreement Ref/No.</label>
                <input 
                  required 
                  type="text" 
                  value={agreementRef}
                  onChange={(e) => setAgreementRef(e.target.value)}
                  className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
                  placeholder="e.g. AGR-2026-1044"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-navy mb-2">Post-Dated Cheque No.</label>
                <input 
                  required 
                  type="text" 
                  value={chequeRef}
                  onChange={(e) => setChequeRef(e.target.value)}
                  className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-line-light text-navy px-4 py-3 text-[14px] font-medium rounded-sm hover:bg-line-light/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gold text-navy-deep px-4 py-3 text-[14px] font-semibold rounded-sm hover:bg-gold-bright transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Conversion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
