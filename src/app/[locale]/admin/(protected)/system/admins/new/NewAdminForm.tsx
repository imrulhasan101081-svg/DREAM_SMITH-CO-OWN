"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewAdminForm({ availablePermissions, defaultPermissions }: { availablePermissions: string[], defaultPermissions: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(defaultPermissions);

  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      router.push("/admin/system/admins");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Full Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px]"
            placeholder="e.g. Jane Doe"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Email Address</label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px]"
            placeholder="name@dreamsmithproperties.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-navy mb-2">Temporary Password</label>
        <input
          required
          type="text"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px]"
          placeholder="Secure password for first login"
        />
        <p className="text-[12px] text-ink/50 mt-1">They will use this to log in via Staff Credentials.</p>
      </div>

      <div className="pt-6 border-t border-line-light">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-[14px] font-medium text-navy">Access Permissions</label>
          <button 
            type="button"
            onClick={() => setSelectedPermissions(defaultPermissions)}
            className="text-[12px] text-gold-bright hover:underline"
          >
            Reset to Defaults
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availablePermissions.map(perm => (
            <label key={perm} className={`flex items-center gap-2 p-3 border rounded-sm cursor-pointer transition-colors ${selectedPermissions.includes(perm) ? 'border-gold bg-gold/5' : 'border-line-light hover:bg-ivory'}`}>
              <input 
                type="checkbox"
                checked={selectedPermissions.includes(perm)}
                onChange={() => handleTogglePermission(perm)}
                className="rounded-sm text-gold focus:ring-gold"
              />
              <span className="text-[12px] font-mono">{perm}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Link href="/admin/system/admins" className="px-6 py-3 border border-line-light rounded-sm text-navy font-medium hover:bg-ivory transition-colors">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gold text-navy-deep py-3 font-semibold rounded-sm hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Admin Account"}
        </button>
      </div>
    </form>
  );
}
