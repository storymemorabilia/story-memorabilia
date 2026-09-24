"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CONDITIONS = [
  { value: "match_worn", label: "Match Worn", desc: "Worn during an actual competition" },
  { value: "game_used", label: "Game Used", desc: "Used in a game, practice, or competition" },
  { value: "team_issued", label: "Team Issued", desc: "Issued by the team, may not have been worn" },
  { value: "signed", label: "Signed", desc: "Signed by the athlete (pre-owned)" },
  { value: "new_signed", label: "New + Signed", desc: "New item, signed by the athlete" },
  { value: "new_with_tags", label: "New w/ Tags", desc: "Unworn, with original tags" },
];

const CATEGORIES = ["Jerseys", "Shoes", "Signed Photos", "Equipment", "Cards", "Accessories", "Other"];

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    sport: "",
    limited_drop: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upload images
    const imageUrls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(data.path);
      imageUrls.push(publicUrl);
    }

    // Create listing
    const priceInCents = Math.round(parseFloat(form.price) * 100);
    const { error: insertError } = await supabase.from("listings").insert({
      athlete_id: user.id,
      title: form.title,
      description: form.description,
      price: priceInCents,
      condition: form.condition,
      category: form.category,
      sport: form.sport,
      images: imageUrls,
      status: "active",
      limited_drop: form.limited_drop,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/athlete?success=listing");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#080808] px-4 py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-cobalt font-display text-xs tracking-widest mb-1">NEW LISTING</p>
            <h1 className="font-display text-white text-3xl">LIST YOUR GEAR</h1>
          </div>
          <Link href="/dashboard/athlete" className="text-white/40 hover:text-white text-sm">
            ← Back
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images */}
          <div className="bg-white border border-ink/10 p-6">
            <h2 className="font-display text-lg mb-4">PHOTOS</h2>
            <label className="block border-2 border-dashed border-ink/20 p-8 text-center cursor-pointer hover:border-cobalt transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="text-ink/40 text-sm">
                {images.length > 0 ? (
                  <span className="text-cobalt font-semibold">{images.length} photo(s) selected</span>
                ) : (
                  <>
                    <p className="font-semibold mb-1">Add photos</p>
                    <p>Up to 5 images · Click or drag to upload</p>
                  </>
                )}
              </div>
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={URL.createObjectURL(img)} alt="" className="aspect-square object-cover" />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white border border-ink/10 p-6 space-y-5">
            <h2 className="font-display text-lg mb-2">ITEM DETAILS</h2>

            <div>
              <label className="text-ink/50 text-xs uppercase tracking-wider block mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-ink/20 px-4 py-3 focus:outline-none focus:border-cobalt text-ink"
                placeholder="e.g. 2024 Season Match Worn Training Jersey #7"
              />
            </div>

            <div>
              <label className="text-ink/50 text-xs uppercase tracking-wider block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-ink/20 px-4 py-3 focus:outline-none focus:border-cobalt text-ink resize-none"
                placeholder="Tell the story behind this item — when was it used, what competition…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-ink/50 text-xs uppercase tracking-wider block mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full border border-ink/20 px-4 py-3 focus:outline-none focus:border-cobalt text-ink bg-white"
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-ink/50 text-xs uppercase tracking-wider block mb-2">Your Sport</label>
                <input
                  type="text"
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                  className="w-full border border-ink/20 px-4 py-3 focus:outline-none focus:border-cobalt text-ink"
                  placeholder="e.g. Football"
                />
              </div>
            </div>

            <div>
              <label className="text-ink/50 text-xs uppercase tracking-wider block mb-2">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-ink/40 font-semibold">$</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="5"
                  step="0.01"
                  className="w-full border border-ink/20 pl-8 pr-4 py-3 focus:outline-none focus:border-cobalt text-ink"
                  placeholder="0.00"
                />
              </div>
              {form.price && !isNaN(parseFloat(form.price)) && (
                <p className="text-ink/40 text-xs mt-1">
                  You receive: ${(parseFloat(form.price) * 0.85).toFixed(2)} after Story&apos;s 15% fee
                </p>
              )}
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white border border-ink/10 p-6">
            <h2 className="font-display text-lg mb-4">CONDITION *</h2>
            <div className="grid grid-cols-2 gap-3">
              {CONDITIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`cursor-pointer border p-4 transition-all ${
                    form.condition === value
                      ? "border-cobalt bg-cobalt/5"
                      : "border-ink/10 hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={value}
                    checked={form.condition === value}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="sr-only"
                    required
                  />
                  <div className="font-semibold text-sm text-ink mb-1">{label}</div>
                  <div className="text-ink/40 text-xs">{desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Limited drop toggle */}
          <div className="bg-white border border-ink/10 p-6">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, limited_drop: !form.limited_drop })}
                className={`w-12 h-6 rounded-full transition-colors ${form.limited_drop ? "bg-cobalt" : "bg-ink/20"} relative`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.limited_drop ? "translate-x-6" : "translate-x-0.5"}`} />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">Mark as Limited Drop</p>
                <p className="text-ink/40 text-xs">Gets promoted in Story&apos;s Drops section</p>
              </div>
            </label>
          </div>

          {error && <p className="text-signal text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cobalt text-white font-semibold text-lg py-5 hover:bg-cobalt-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Publishing…" : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
