"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CMSForm({ section, fields }: { section: string; fields: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Transform fields array into an object for easier controlled inputs
  const initialData = fields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // We will send patches for all fields in this section
      const promises = fields.map(field => {
        if (formData[field.key] !== field.value) {
          return fetch(`/api/admin/content/${section}/${field.key}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: formData[field.key] }),
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to update ${field.label}`);
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      setSuccess("Section updated successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
      {success && <div className="bg-sage/10 text-sage p-4 text-[13px] rounded-sm">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => (
          <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <label className="block text-[13px] font-medium text-navy mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                required
                rows={3}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] resize-y"
              />
            ) : (
              <input
                required
                type={field.type}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-line-light flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-ivory px-8 py-2.5 rounded-sm hover:bg-navy-light font-medium disabled:opacity-50 text-[14px]"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
