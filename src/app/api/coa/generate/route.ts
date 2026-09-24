import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function generateCOAId(seq: number): string {
  const year = new Date().getFullYear();
  const num = String(seq).padStart(5, "0");
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `STR-${year}-${num}-${suffix}`;
}

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  const supabase = await createAdminClient();

  // Get order details
  const { data: order } = await supabase
    .from("orders")
    .select("*, listing:listings(*)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Get next sequence number
  const { count } = await supabase.from("coas").select("*", { count: "exact", head: true });
  const seq = (count || 0) + 1;
  const coaId = generateCOAId(seq);

  // Create COA record
  const { data: coa } = await supabase.from("coas").insert({
    id: coaId,
    order_id: orderId,
    listing_id: order.listing_id,
    athlete_id: order.athlete_id,
    verified: true,
  }).select().single();

  // Update order with COA id
  await supabase.from("orders").update({ coa_id: coaId }).eq("id", orderId);

  return NextResponse.json({ coaId, coa });
}
