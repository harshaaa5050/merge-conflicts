import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use service role client — webhook has no user session
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { user_id?: string } };
    const userId = session.metadata?.user_id;
    if (userId) {
      const supabase = createAdminClient();
      await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);
      await supabase
        .from("professional_profiles")
        .update({ is_premium: true })
        .eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
