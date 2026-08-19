"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GlobalMediaManager({ initialMedia, canUpload, canDelete }: { initialMedia: any[], canUpload: boolean, canDelete: boolean }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState(initialMedia);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Fake upload form for demo (would be UploadThing in production)
  const [newMedia, setNewMedia] = useState({
    url: "",
    originalName: "",
    altText: ""
  });

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url || !newMedia.originalName) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        filename: newMedia.url.split('/').pop() || 'unknown',
        originalName: newMedia.originalName,
        mimeType: newMedia.url.includes('.pdf') ? 'application/pdf' : 'image/jpeg',
        size: 1024,
        url: newMedia.url,
        storageKey: newMedia.url,
        altText: newMedia.altText
      };

      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add media");

      setMediaList([data.media, ...mediaList]);
      setNewMedia({ url: "", originalName: "", altText: "" });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedia = async (id: string) => {
    if (!window.confirm("Archive this media asset? It will be kept in the DB but hidden.")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove media");
      }

      setMediaList(mediaList.filter(m => m._id !== id));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm mb-6">{error}</div>}
      
      {canUpload && (
        <form onSubmit={handleAddMedia} className="mb-8 p-6 border border-line-light rounded-sm bg-ivory-dim">
          <h3 className="text-[14px] font-medium text-navy mb-4">Register New Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[12px] font-medium text-navy mb-1">External URL</label>
              <input required type="url" value={newMedia.url} onChange={(e) => setNewMedia({...newMedia, url: e.target.value})} placeholder="https://" className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-navy mb-1">File Name / Label</label>
              <input required type="text" value={newMedia.originalName} onChange={(e) => setNewMedia({...newMedia, originalName: e.target.value})} placeholder="Hero Banner" className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-navy mb-1">Alt Text (SEO)</label>
              <input type="text" value={newMedia.altText} onChange={(e) => setNewMedia({...newMedia, altText: e.target.value})} placeholder="Description of image" className="w-full border border-line-light rounded-sm px-3 py-2 text-[13px]" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-navy text-ivory px-6 py-2 rounded-sm hover:bg-navy-light text-[13px] font-medium disabled:opacity-50">
              {loading ? "Registering..." : "Add to Library"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.length === 0 ? (
          <div className="col-span-full text-center py-12 text-ink/50 border border-dashed border-line-light">
            Library is empty.
          </div>
        ) : (
          mediaList.map((asset) => (
            <div key={asset._id} className="group bg-white border border-line-light rounded-sm overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-[4/3] bg-ivory-dim relative border-b border-line-light flex items-center justify-center p-4">
                {asset.mimeType?.includes('image') ? (
                  <Image
                    src={asset.url}
                    alt={asset.altText || asset.originalName}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-ink/40 flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-[12px] uppercase font-mono">{asset.mimeType?.split('/')[1] || 'FILE'}</span>
                  </div>
                )}
                
                {canDelete && (
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleRemoveMedia(asset._id)} className="bg-red-500 text-white px-4 py-2 rounded-sm text-[12px] font-medium hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="p-3 text-[11px] flex-1 flex flex-col">
                <div className="font-medium text-navy truncate mb-1" title={asset.originalName}>{asset.originalName}</div>
                <div className="text-ink/50 flex justify-between mt-auto">
                  <span>{formatBytes(asset.size)}</span>
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
