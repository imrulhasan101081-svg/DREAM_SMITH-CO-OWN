"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingManager({ initialPlans }: { initialPlans: any[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyPlan = {
    name: "",
    description: "",
    shares: 1,
    price: 400000,
    features: [""],
    isFeatured: false,
    order: plans.length
  };

  const [formData, setFormData] = useState(emptyPlan);

  const startEdit = (plan: any) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      shares: plan.shares,
      price: plan.price,
      features: [...plan.features],
      isFeatured: plan.isFeatured,
      order: plan.order
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyPlan);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ""),
        shares: Number(formData.shares),
        price: Number(formData.price),
        order: Number(formData.order)
      };

      const url = editingId ? `/api/admin/pricing/${editingId}` : "/api/admin/pricing";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save pricing plan");
      }

      setEditingId(null);
      setFormData(emptyPlan);
      router.refresh();
      // Optimistic update would be better, but refresh is simpler for now
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing plan?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pricing plan");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-ivory-dim p-6 border border-line-light rounded-sm sticky top-24">
            <h2 className="text-[16px] font-medium text-navy mb-4 border-b border-line-light pb-2">
              {editingId ? "Edit Pricing Tier" : "Add New Tier"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-navy mb-1">Tier Name (e.g. Starter)</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px] focus:border-gold outline-none" />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-navy mb-1">Description</label>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px] focus:border-gold outline-none resize-y" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-navy mb-1">Total Shares</label>
                  <input required type="number" min="1" value={formData.shares} onChange={e => setFormData({...formData, shares: parseInt(e.target.value)})} className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px] focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-navy mb-1">Price (৳)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px] focus:border-gold outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-navy mb-1">Display Order</label>
                <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px] focus:border-gold outline-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="text-gold focus:ring-gold" />
                <span className="text-[13px] font-medium text-navy">Mark as &quot;Most Popular&quot;</span>
              </label>

              <div className="pt-4 border-t border-line-light">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[12px] font-medium text-navy">Features</label>
                  <button type="button" onClick={addFeature} className="text-[11px] text-gold-bright hover:underline">+ Add Feature</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={feat} 
                        onChange={e => handleFeatureChange(idx, e.target.value)} 
                        placeholder="Feature description"
                        className="flex-1 border border-line-light rounded-sm px-3 py-1.5 text-[12px] focus:border-gold outline-none" 
                      />
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700 px-2 text-[16px]">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                {editingId && <button type="button" onClick={cancelEdit} className="flex-1 border border-line-light bg-white py-2 text-[13px] rounded-sm hover:bg-ivory transition-colors">Cancel</button>}
                <button type="submit" disabled={loading} className="flex-1 bg-navy text-ivory py-2 text-[13px] rounded-sm hover:bg-navy-light transition-colors disabled:opacity-50">
                  {loading ? "Saving..." : editingId ? "Update Tier" : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan: any) => (
              <div key={plan._id} className={`bg-white border ${plan.isFeatured ? 'border-gold shadow-md relative' : 'border-line-light'} rounded-sm p-6 flex flex-col`}>
                {plan.isFeatured && <div className="absolute top-0 right-0 bg-gold text-navy-deep text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-sm">Popular</div>}
                
                <h3 className="font-serif text-[20px] text-navy mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[24px] font-medium text-navy">৳{plan.price.toLocaleString()}</span>
                  <span className="text-[12px] text-ink/50 uppercase tracking-widest">/ {plan.shares} {plan.shares === 1 ? 'Share' : 'Shares'}</span>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1 text-[13px] text-ink/80">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold-bright mt-0.5">✓</span> <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line-light pt-4 flex gap-3 mt-auto">
                  <button onClick={() => startEdit(plan)} className="flex-1 border border-line-light py-2 rounded-sm text-[12px] font-medium hover:bg-ivory transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(plan._id)} className="flex-1 border border-red-500/30 text-red-500 py-2 rounded-sm text-[12px] font-medium hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {plans.length === 0 && (
              <div className="col-span-full p-12 text-center border border-dashed border-line-light text-ink/50">
                No pricing plans created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
