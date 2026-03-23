import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ProHeader } from "@/components/pro-header";
import { ConsultationRoom } from "@/components/consultation-room";

interface Props {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ professionalId?: string; asDoctor?: string }>;
}

export default async function ConsultationPage({
  params,
  searchParams,
}: Props) {
  const { roomId } = await params;
  const { professionalId, asDoctor } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");
  if (!professionalId) redirect("/doctors");

  const isDoctorView = asDoctor === "true";

  // Fetch professional — if doctor is joining, skip is_verified check (they need to join even if pending)
  const query = supabase
    .from("professional_profiles")
    .select("id, full_name, specialization, role, is_verified, user_id")
    .eq("id", professionalId);

  if (!isDoctorView) {
    // Patients can only call verified professionals
    query.eq("is_verified", true);
  }

  const { data: professional } = await query.single();

  if (!professional) redirect(isDoctorView ? "/pro/dashboard" : "/doctors");

  // If doctor is joining, verify they are actually this professional
  if (isDoctorView && professional.user_id !== user.id) {
    redirect("/pro/dashboard");
  }

  const Header = isDoctorView ? ProHeader : AppHeader;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ConsultationRoom
        roomName={roomId}
        userId={user.id}
        userName={user.email ?? user.id}
        professional={professional}
        isDoctor={isDoctorView}
      />
    </div>
  );
}
