"use server";

import { stripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function createCheckoutSession(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const product = getProduct(productId);
  if (!product) throw new Error("Product not found");

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  // For ₹0 (free launch) — skip Stripe, mark premium directly
  if (product.launchPriceInPaise === 0) {
    // Update profiles table
    await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", user.id);
    // Also update professional_profiles if they have one
    await supabase
      .from("professional_profiles")
      .update({ is_premium: true })
      .eq("user_id", user.id);
    return { free: true };
  }

  // Paid flow — create/get Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email! });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.launchPriceInPaise,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { user_id: user.id, product_id: productId },
  });

  return { clientSecret: session.client_secret };
}
