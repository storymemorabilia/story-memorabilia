"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  listingId: string;
  price: number;
  title: string;
}

export default function BuyButton({ listingId, price, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, price, title }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const { url, error } = await res.json();
    if (error) {
      alert(error);
      setLoading(false);
      return;
    }

    window.location.href = url;
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-cobalt text-white font-semibold text-lg py-5 hover:bg-cobalt-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecting to checkout…" : "Buy Now"}
    </button>
  );
}
