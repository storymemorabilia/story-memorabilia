import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  const supabase = await createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, athlete:profiles!athlete_id(*), buyer:profiles!buyer_id(*)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Create Shippo shipment + transaction (prepaid label)
  const shippoRes = await fetch("https://api.goshippo.com/transactions/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shipment: {
        address_from: {
          name: order.athlete.full_name,
          email: order.athlete.email,
          country: "US",
        },
        address_to: {
          name: order.shipping_name || order.buyer.full_name,
          street1: order.shipping_line1,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          country: order.shipping_country || "US",
        },
        parcels: [{
          length: "12",
          width: "9",
          height: "3",
          distance_unit: "in",
          weight: "1.5",
          mass_unit: "lb",
        }],
        extra: {
          insurance: {
            amount: String(order.price_cents / 100),
            currency: "USD",
            content: "Sports Memorabilia",
          },
        },
      },
      carrier_account: "shippo_usps_account",
      servicelevel_token: "usps_priority",
      label_file_type: "PDF",
      async: false,
    }),
  });

  const shippoData = await shippoRes.json();

  if (shippoData.status === "SUCCESS") {
    await supabase.from("orders").update({
      status: "paid",
      shippo_transaction_id: shippoData.object_id,
      tracking_number: shippoData.tracking_number,
      tracking_url: shippoData.tracking_url_provider,
      shipping_label_url: shippoData.label_url,
    }).eq("id", orderId);

    // TODO: Send label email to athlete via Mailchimp or Postmark
    // The athlete receives an email with their prepaid label URL
  }

  return NextResponse.json({ success: true, tracking: shippoData.tracking_number });
}
