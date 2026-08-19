"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MediaManager({ projectId, initialMedia }: { projectId: string, initialMedia: any[] }) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    setLoading(true);
    setError("");

    try {
      const updatedMedia = [...media, newImageUrl];
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery: updatedMedia }),
      });

      if (!res.ok) throw new Error("Failed to add media");

      setMedia(updatedMedia);
      setNewImageUrl("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedia = async (indexToRemove: number) => {
    if (!window.confirm("Remove this image from the gallery?")) return;

    setLoading(true);
    try {
      const updatedMedia = media.filter((_, idx) => idx !== indexToRemove);
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery: updatedMedia }),
      });

      if (!res.ok) throw new Error("Failed to remove media");

      setMedia(updatedMedia);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm mb-6">{error}</div>}
      
      <form onSubmit={handleAddMedia} className="mb-8 p-6 border border-line-light rounded-sm bg-ivory-dim flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-[13px] font-medium text-navy mb-2">Add Image URL (External link for now)</label>
          <input
            type="url"
            required
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-line-light rounded-sm px-4 py-2.5 focus:outline-none focus:border-gold text-[14px]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !newImageUrl}
          className="bg-navy text-ivory px-6 py-2.5 rounded-sm hover:bg-navy-light font-medium disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Gallery"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.length === 0 ? (
          <div className="col-span-full text-center py-12 text-ink/50 border border-dashed border-line-light">
            No media added yet.
          </div>
        ) : (
          media.map((url, idx) => (
            <div key={idx} className="relative group aspect-[4/3] bg-white border border-line-light rounded-sm overflow-hidden shadow-sm">
              <Image
                src={url}
                alt={`Gallery Image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleRemoveMedia(idx)}
                  className="bg-red-500 text-white px-4 py-2 rounded-sm text-[12px] font-medium hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
