"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfileForm({ investor }: { investor: any }) {
  const router = useRouter();
  const t = useTranslations('Portal.profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    contact: investor.contact || "",
    email: investor.email || "",
    nominee_name: investor.nominee_name || "",
    nominee_relation: investor.nominee_relation || "",
    address: investor.address || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-line-light bg-ivory-dim flex justify-between items-center">
          <h2 className="font-serif text-[18px] text-navy">{t('identityKyc')}</h2>
          <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
            investor.kyc_status === 'verified' ? 'bg-sage/10 text-sage' : 'bg-gold/10 text-gold-bright'
          }`}>
            {investor.kyc_status}
          </span>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('fullName')}</div>
              <div className="text-[15px] font-medium text-navy">{investor.name}</div>
            </div>
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('nidPassport')}</div>
              <div className="text-[15px] font-medium text-navy font-mono">
                {investor.nid_number ? investor.nid_number.replace(/.(?=.{4})/g, '*') : t('notAvailable')}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('permanentAddress')}</div>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-line-light rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-gold"
                rows={3}
              />
            ) : (
              <div className="text-[15px] text-navy">{investor.address || t('notAvailable')}</div>
            )}
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-sm text-[13px] border border-blue-100">
            {t('identityNotice')}
          </div>
        </div>
      </div>

      <div className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-line-light bg-ivory-dim flex justify-between items-center">
          <h2 className="font-serif text-[18px] text-navy">{t('contactNominee')}</h2>
          {isEditing && (
            <button
              onClick={() => {
                setFormData({
                  contact: investor.contact || "",
                  email: investor.email || "",
                  nominee_name: investor.nominee_name || "",
                  nominee_relation: investor.nominee_relation || "",
                  address: investor.address || ""
                });
                setError("");
                setIsEditing(false);
              }}
              className="text-[13px] text-ink/60 hover:text-navy"
            >
              {t('cancel')}
            </button>
          )}
        </div>

        <div className="p-8 space-y-6">
          {error && <div className="text-red-600 text-[13px]">{error}</div>}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('mobileNumber')}</div>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border border-line-light rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-gold"
                />
              ) : (
                <div className="text-[15px] font-medium text-navy">{investor.contact}</div>
              )}
            </div>
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('emailAddress')}</div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-line-light rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-gold"
                />
              ) : (
                <div className="text-[15px] font-medium text-navy">{investor.email}</div>
              )}
            </div>
          </div>

          <hr className="border-line-light" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('nomineeName')}</div>
              {isEditing ? (
                <input
                  type="text"
                  name="nominee_name"
                  value={formData.nominee_name}
                  onChange={handleChange}
                  className="w-full border border-line-light rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-gold"
                />
              ) : (
                <div className="text-[15px] font-medium text-navy">{investor.nominee_name || t('notAvailable')}</div>
              )}
            </div>
            <div>
              <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('nomineeRelation')}</div>
              {isEditing ? (
                <input
                  type="text"
                  name="nominee_relation"
                  value={formData.nominee_relation}
                  onChange={handleChange}
                  className="w-full border border-line-light rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-gold"
                />
              ) : (
                <div className="text-[15px] font-medium text-navy">{investor.nominee_relation || t('notAvailable')}</div>
              )}
            </div>
          </div>

          <div className="pt-4">
             {isEditing ? (
               <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-navy text-ivory px-6 py-2.5 text-[13px] font-medium rounded-sm hover:bg-navy-deep transition-colors disabled:opacity-50"
               >
                 {isSaving ? t('saving') : t('saveChanges')}
               </button>
             ) : (
               <button
                onClick={() => setIsEditing(true)}
                className="bg-line-light text-navy hover:bg-gold/20 hover:text-navy-deep px-6 py-2.5 text-[13px] font-medium rounded-sm transition-colors"
               >
                 {t('editContactDetails')}
               </button>
             )}
          </div>
        </div>
      </div>
    </>
  );
}
