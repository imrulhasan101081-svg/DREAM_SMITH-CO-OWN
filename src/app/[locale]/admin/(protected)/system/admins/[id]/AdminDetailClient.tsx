"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDetailClient({ admin, availablePermissions }: { admin: any; availablePermissions: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: admin.name,
    isActive: admin.isActive,
    newPassword: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(admin.permissions || []);

  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/admins/${admin._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update admin");

      setSuccess("Account updated successfully.");
      setFormData(prev => ({ ...prev, newPassword: "" })); // Clear password field
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to deactivate and archive ${admin.name}? This action can only be undone via the database.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/admins/${admin._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete admin");

      router.push("/admin/system/admins");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isSuperAdmin = admin.role === "SUPER_ADMIN";

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>}
      {success && <div className="bg-sage/10 text-sage p-4 text-[13px] rounded-sm">{success}</div>}

      <div>
        <label className="block text-[13px] font-medium text-navy mb-2">Full Name</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSuperAdmin}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] disabled:bg-ivory-dim disabled:text-ink/50"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-navy mb-2">Email Address</label>
        <input
          type="email"
          value={admin.email}
          disabled
          className="w-full border border-line-light rounded-sm px-4 py-3 bg-ivory-dim text-ink/50 text-[14px]"
        />
        <p className="text-[12px] text-ink/50 mt-1">Email addresses cannot be changed once created.</p>
      </div>

      {!isSuperAdmin && (
        <div>
          <label className="block text-[13px] font-medium text-navy mb-2">Reset Password</label>
          <input
            type="text"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Leave blank to keep current password"
            className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px]"
          />
        </div>
      )}

      {!isSuperAdmin && (
        <div>
          <label className="flex items-center gap-2 p-4 border border-line-light rounded-sm cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded-sm text-gold focus:ring-gold"
            />
            <span className="text-[14px] font-medium text-navy">Account is Active</span>
          </label>
          <p className="text-[12px] text-ink/50 mt-1">Uncheck this to temporarily suspend access without deleting the account.</p>
        </div>
      )}

      {!isSuperAdmin && (
        <div className="pt-6 border-t border-line-light">
          <label className="block text-[14px] font-medium text-navy mb-4">Access Permissions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      )}

      <div className="flex gap-4 pt-6 border-t border-line-light">
        {!isSuperAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Archive Account
          </button>
        )}
        <div className="flex-1"></div>
        <button
          type="submit"
          disabled={loading || isSuperAdmin}
          className="px-8 bg-gold text-navy-deep py-3 font-semibold rounded-sm hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
