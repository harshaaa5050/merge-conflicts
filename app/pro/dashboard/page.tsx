import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProHeader } from "@/components/pro-header";
import { ProDashboardContent } from "@/components/pro-dashboard-content";

export default async function ProDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get professional profile for this user
  const { data: profile } = await supabase
    .from("professional_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Not a registered professional — redirect to registration
  if (!profile) redirect("/auth/professional-register");

  // Fetch all consultations assigned to this professional, newest first
  const { data: consultations } = await supabase
    .from("consultations")
    .select("id, room_name, status, created_at, started_at, ended_at, user_id")
    .eq("professional_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <ProHeader />
      <ProDashboardContent
        profile={profile}
        consultations={consultations ?? []}
      />
    </div>
  );
}
