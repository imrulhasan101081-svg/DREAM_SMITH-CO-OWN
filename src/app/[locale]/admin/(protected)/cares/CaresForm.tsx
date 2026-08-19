'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CaresForm({ projects }: { projects: any[] }) {
  const [initiative, setInitiative] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState(projects[0]?._id || '');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const evidenceArray = evidence.split(',').map(p => p.trim()).filter(Boolean);
      
      const res = await fetch(`/api/admin/cares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiative,
          amount,
          date,
          project_id: projectId,
          evidence: evidenceArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post entry');
      }

      setInitiative('');
      setAmount('');
      setEvidence('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line-light p-6 rounded-sm shadow-sm space-y-5">
      <h3 className="font-serif text-[20px] text-navy mb-4">Log Charity Distribution</h3>
      
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Initiative Name</label>
          <input 
            required 
            type="text" 
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
            placeholder="e.g. Winter Blankets for Orphans"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Amount (৳)</label>
          <input 
            required 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
            placeholder="50000"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Funding Project</label>
          <select 
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]"
          >
            {projects.map(p => (
              <option key={p._id.toString()} value={p._id.toString()}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Distribution Date</label>
          <input 
            required 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
          />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-navy mb-2">Evidence Photo URLs (comma separated)</label>
        <input 
          type="text" 
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
          placeholder="https://example.com/receipt.jpg"
        />
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-navy text-ivory px-6 py-3 text-[14px] font-medium rounded-sm hover:bg-navy-deep transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Logging...' : 'Publish to Ledger'}
        </button>
      </div>
    </form>
  );
}
