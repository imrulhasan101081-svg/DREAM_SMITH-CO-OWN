'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProgressForm({ projectId }: { projectId: string }) {
  const [phase, setPhase] = useState('land_permits');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState(''); // comma separated for now
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const photoArray = photos.split(',').map(p => p.trim()).filter(Boolean);
      
      const res = await fetch(`/api/admin/projects/${projectId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          date,
          description,
          photos: photoArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post update');
      }

      setPhase('land_permits');
      setDescription('');
      setPhotos('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line-light p-6 rounded-sm shadow-sm space-y-5">
      <h3 className="font-serif text-[20px] text-navy mb-4">Post New Update</h3>
      
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Construction Phase</label>
          <select 
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]"
          >
            <option value="land_permits">Land & Permits</option>
            <option value="foundation">Foundation</option>
            <option value="structure">Structure</option>
            <option value="finishing">Finishing & Utilities</option>
            <option value="handover">Handover</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Update Date</label>
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
        <label className="block text-[13px] font-medium text-navy mb-2">Description</label>
        <textarea 
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]"
          placeholder="Detailed description of the progress..."
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-navy mb-2">Photo URLs (comma separated)</label>
        <input 
          type="text" 
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
          className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]" 
          placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
        />
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-navy text-ivory px-6 py-3 text-[14px] font-medium rounded-sm hover:bg-navy-deep transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Update (Immutable)'}
        </button>
      </div>
    </form>
  );
}
