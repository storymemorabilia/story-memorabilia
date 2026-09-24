import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function VerifyPage({ params }: { params: Promise<{ coaId: string }> }) {
  const { coaId } = await params;
  const supabase = await createClient();

  const { data: coa } = await supabase
    .from("coas")
    .select("*, athlete:profiles!athlete_id(*), listing:listings(*)")
    .eq("id", coaId)
    .single();

  if (!coa) notFound();

  const issueDate = new Date(coa.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-white text-4xl inline-block mb-8">
            STORY<span className="text-cobalt">.</span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-cobalt/20 border border-cobalt/40 px-4 py-2 rounded-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-cobalt inline-block" />
            <span className="text-cobalt text-sm font-semibold">VERIFIED AUTHENTIC</span>
          </div>
          <h1 className="font-display text-white text-4xl md:text-5xl">
            CERTIFICATE OF<br />AUTHENTICITY
          </h1>
        </div>

        {/* COA Card */}
        <div className="border border-white/20 bg-white/5 p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Certificate ID</p>
              <p className="text-white font-mono text-sm">{coa.id}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Issued</p>
              <p className="text-white text-sm">{issueDate}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Athlete</p>
              <p className="text-white font-semibold">{coa.athlete?.full_name}</p>
              <p className="text-white/40 text-xs">{coa.athlete?.sport}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Item</p>
              <p className="text-white text-sm">{coa.listing?.title}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/50 text-xs leading-relaxed">
              This certificate confirms that the item described above has been verified as authentic by Story Memorabilia.
              The athlete listed above has been personally vetted by our team. This certificate is permanently linked to
              this item and transfers with ownership.
            </p>
          </div>

          {/* Athlete video */}
          {coa.athlete_video_url && (
            <div className="mt-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Athlete Verification Video</p>
              <a
                href={coa.athlete_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-cobalt/20 border border-cobalt/30 px-4 py-3 hover:bg-cobalt/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-cobalt flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                    <path d="M1 1l10 6L1 13V1z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Watch Authentication Video</p>
                  <p className="text-white/40 text-xs">{coa.athlete?.full_name} with this item</p>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Verified by Story */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-white/40 text-xs">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#0047CC" strokeWidth="1.5"/>
              <path d="M4 7l2 2 4-4" stroke="#0047CC" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Verified by Story Memorabilia · storymemorabilia.com
          </div>
        </div>
      </div>
    </div>
  );
}
