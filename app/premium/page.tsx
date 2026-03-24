import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PremiumPageContent } from "@/components/premium-page-content";
import { PRODUCTS } from "@/lib/products";

export default async function PremiumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, full_name")
    .eq("id", user.id)
    .single();

  // Also check professional profile
  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("is_premium")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPremium = profile?.is_premium || pro?.is_premium || false;
  const product = PRODUCTS[0];

  return (
    <PremiumPageContent
      isPremium={isPremium}
      product={product}
      userName={profile?.full_name ?? ""}
    />
  );
}
