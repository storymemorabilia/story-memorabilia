import Link from "next/link";
import React from "react";
import type { Listing } from "@/types";

const CONDITION_LABELS: Record<string, string> = {
  match_worn: "Match Worn",
  game_used: "Game Used",
  team_issued: "Team Issued",
  signed: "Signed",
  new_signed: "New + Signed",
  new_with_tags: "New w/ Tags",
};

const CONDITION_STYLE: Record<string, React.CSSProperties> = {
  match_worn: {backgroundColor: "#1a1a2e", color: "white"},
  game_used: {backgroundColor: "#0047CC", color: "white"},
  team_issued: {backgroundColor: "#080808", color: "white"},
  signed: {backgroundColor: "#E8002A", color: "white"},
  new_signed: {backgroundColor: "#2d5a27", color: "white"},
  new_with_tags: {backgroundColor: "#5a4a2d", color: "white"},
};

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const mainImage = listing.images?.[0];
  const price = (listing.price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return (
    <Link href={`/listing/${listing.id}`} className="group block bg-white border border-ink/10 transition-colors" style={{"--hover-border": "#0047CC"} as React.CSSProperties}>
      {/* Image */}
      <div className="aspect-square bg-[#f0f0f0] relative overflow-hidden">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}

        {/* Condition tag */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2 py-1" style={CONDITION_STYLE[listing.condition] || {backgroundColor:"#080808",color:"white"}}>
            {CONDITION_LABELS[listing.condition] || listing.condition}
          </span>
        </div>

        {/* Limited drop badge */}
        {listing.limited_drop && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2 py-1 bg-signal text-white">DROP</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {listing.athlete && (
          <p className="text-ink/40 text-xs mb-1 font-medium uppercase tracking-wider">
            {listing.athlete.full_name}
            {listing.athlete.sport && ` · ${listing.athlete.sport}`}
          </p>
        )}
        <h3 className="font-semibold text-ink text-sm mb-2 leading-tight line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl" style={{color:"#0047CC"}}>{price}</span>
          <span className="text-ink/30 text-xs flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" fill="#0047CC"/>
            </svg>
            Story Verified
          </span>
        </div>
      </div>
    </Link>
  );
}
