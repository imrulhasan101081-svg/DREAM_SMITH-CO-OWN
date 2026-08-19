"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProjectForm({ project, isNew = false }: { project?: any; isNew?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: project?.name || "",
    slug: project?.slug || "",
    location: project?.location || "",
    address: project?.address || "",
    structure_details: project?.structure_details || "",
    description: project?.description || "",
    total_shares: project?.total_shares || 0,
    price_per_share: project?.price_per_share || 0,
    buyback_amount: project?.buyback_amount || 0,
    term_months: project?.term_months || 36,
    construction_months: project?.construction_months || 30,
    first_refusal_rate: project?.first_refusal_rate || 5500,
    status: project?.status || "planning",
    land_area: project?.land_area || "",
  });

  const [amenitiesStr, setAmenitiesStr] = useState((project?.amenities || []).join(", "));
  const [facilitiesStr, setFacilitiesStr] = useState((project?.facilities || []).join(", "));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      total_shares: Number(formData.total_shares),
      price_per_share: Number(formData.price_per_share),
      buyback_amount: Number(formData.buyback_amount),
      term_months: Number(formData.term_months),
      construction_months: Number(formData.construction_months),
      first_refusal_rate: Number(formData.first_refusal_rate),
      amenities: amenitiesStr.split(",").map((s: string) => s.trim()).filter(Boolean),
      facilities: facilitiesStr.split(",").map((s: string) => s.trim()).filter(Boolean),
    };

    try {
      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${project._id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      if (isNew) {
        router.push("/admin/projects");
      } else {
        setSuccess("Project updated successfully.");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, slug });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
      {success && <div className="bg-sage/10 text-sage p-4 text-[13px] rounded-sm">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-[13px] uppercase tracking-widest text-ink/40 font-mono mb-2">Basic Info</h3>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Project Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onBlur={generateSlug} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">URL Slug</label>
            <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px] bg-ivory-dim" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Location (Short)</label>
            <input required type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px] bg-white">
              <option value="planning">Planning</option>
              <option value="under_construction">Under Construction</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[13px] uppercase tracking-widest text-ink/40 font-mono mb-2">Financial Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Total Shares</label>
              <input required type="number" min="1" value={formData.total_shares} onChange={(e) => setFormData({ ...formData, total_shares: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Price per Share (৳)</label>
              <input required type="number" min="0" value={formData.price_per_share} onChange={(e) => setFormData({ ...formData, price_per_share: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Buyback Amount (৳)</label>
              <input required type="number" min="0" value={formData.buyback_amount} onChange={(e) => setFormData({ ...formData, buyback_amount: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Term Length (Months)</label>
              <input required type="number" min="1" value={formData.term_months} onChange={(e) => setFormData({ ...formData, term_months: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Constr. Time (Months)</label>
              <input required type="number" min="1" value={formData.construction_months} onChange={(e) => setFormData({ ...formData, construction_months: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Right of Refusal (৳/sqft)</label>
              <input required type="number" min="0" value={formData.first_refusal_rate} onChange={(e) => setFormData({ ...formData, first_refusal_rate: Number(e.target.value) })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[13px] uppercase tracking-widest text-ink/40 font-mono mb-2">Extended Details</h3>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-1">Full Address</label>
          <input required type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Structure Details (e.g., 10-storey...)</label>
            <input type="text" value={formData.structure_details} onChange={(e) => setFormData({ ...formData, structure_details: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Land Area (e.g., 0.10240 Acre)</label>
            <input type="text" value={formData.land_area} onChange={(e) => setFormData({ ...formData, land_area: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px]" />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-1">Full Description</label>
          <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px] resize-y"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Amenities (Comma separated)</label>
            <textarea rows={3} value={amenitiesStr} onChange={(e) => setAmenitiesStr(e.target.value)} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px] resize-y" placeholder="CCTV, Backup Generator, Security"></textarea>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Facilities (Comma separated)</label>
            <textarea rows={3} value={facilitiesStr} onChange={(e) => setFacilitiesStr(e.target.value)} className="w-full border border-line-light rounded-sm px-3 py-2 focus:outline-none focus:border-gold text-[14px] resize-y" placeholder="Residential Flats, Studio Apartments, Parking"></textarea>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-line-light">
        <Link href="/admin/projects" className="px-6 py-3 border border-line-light rounded-sm text-navy font-medium hover:bg-ivory transition-colors">
          Cancel
        </Link>
        <div className="flex-1"></div>
        <button type="submit" disabled={loading} className="px-8 bg-gold text-navy-deep py-3 font-semibold rounded-sm hover:bg-gold-bright transition-colors disabled:opacity-50">
          {loading ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
