import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DoctorsContent } from "@/components/doctors-content";

export default async function DoctorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: professionals }, { data: profile }, { data: pro }] =
    await Promise.all([
      supabase
        .from("professional_profiles")
        .select(
          "id, full_name, email, role, specialization, years_experience, license_number, registration_type, bio, status, is_verified, created_at",
        )
        .order("is_verified", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("is_premium").eq("id", user.id).single(),
      supabase
        .from("professional_profiles")
        .select("is_premium")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  const isPremium = profile?.is_premium || pro?.is_premium || false;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <DoctorsContent
        professionals={professionals ?? []}
        currentUserId={user.id}
        isPremium={isPremium}
      />
    </div>
  );
}
