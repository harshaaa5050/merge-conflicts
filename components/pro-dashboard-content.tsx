"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  ShieldCheck,
  ShieldOff,
  Stethoscope,
  CalendarClock,
  TrendingUp,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

type Consultation = {
  id: string;
  room_name: string;
  status: "waiting" | "active" | "ended";
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  user_id: string;
};

type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  specialization: string;
  years_experience: number;
  license_number: string;
  registration_type: string;
  bio: string | null;
  status: string;
  is_verified: boolean;
};

interface ProDashboardContentProps {
  profile: Profile;
  consultations: Consultation[];
}

function StatusBadge({ status }: { status: string }) {
  if (status === "waiting")
    return (
      <Badge
        variant="outline"
        className="gap-1 text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30"
      >
        <Clock className="h-3 w-3" />
        Waiting
      </Badge>
    );
  if (status === "active")
    return (
      <Badge
        variant="outline"
        className="gap-1 text-green-600 border-green-400 bg-green-50 dark:bg-green-950/30"
      >
        <CheckCircle2 className="h-3 w-3" />
        Active
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <XCircle className="h-3 w-3" />
      Ended
    </Badge>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={copy}
      title="Copy link"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

export function ProDashboardContent({
  profile,
  consultations,
}: ProDashboardContentProps) {
  const router = useRouter();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const waiting = consultations.filter((c) => c.status === "waiting");
  const active = consultations.filter((c) => c.status === "active");
  const ended = consultations.filter((c) => c.status === "ended");

  const joinCall = (consultation: Consultation) => {
    setJoiningId(consultation.id);
    router.push(
      `/consultation/${consultation.room_name}?professionalId=${profile.id}&asDoctor=true`,
    );
  };

  const getCallLink = (roomName: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/consultation/${roomName}?professionalId=${profile.id}&asDoctor=true`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (started: string | null, ended: string | null) => {
    if (!started || !ended) return null;
    const mins = Math.round(
      (new Date(ended).getTime() - new Date(started).getTime()) / 60000,
    );
    return `${mins} min`;
  };

  return (
    <main className="container px-4 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground">
            Dr. {profile.full_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile.specialization} · {profile.registration_type} Registered
          </p>
        </div>
        {profile.is_verified ? (
          <Badge className="self-start sm:self-center gap-1.5 bg-green-500/10 text-green-600 border border-green-400 py-1.5 px-3">
            <ShieldCheck className="h-4 w-4" /> Verified Professional
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="self-start sm:self-center gap-1.5 text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 py-1.5 px-3"
          >
            <ShieldOff className="h-4 w-4" />
            {profile.status === "pending"
              ? "Verification Pending"
              : "Not Verified"}
          </Badge>
        )}
      </div>

      {/* Pending verification notice */}
      {!profile.is_verified && (
        <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300 text-sm">
                Account under review
              </p>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-0.5">
                Your credentials are being verified. You will be able to receive
                video consultations once approved. This typically takes 2–3
                business days.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Waiting",
            value: waiting.length,
            icon: Clock,
            color: "text-yellow-500",
          },
          {
            label: "Active",
            value: active.length,
            icon: Video,
            color: "text-green-500",
          },
          {
            label: "Completed",
            value: ended.length,
            icon: CheckCircle2,
            color: "text-primary",
          },
          {
            label: "Total",
            value: consultations.length,
            icon: TrendingUp,
            color: "text-muted-foreground",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incoming / Active Calls */}
      {(waiting.length > 0 || active.length > 0) && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-5 w-5 text-primary" />
              Incoming & Active Calls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...active, ...waiting].map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      Patient request
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(c.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-0 sm:ml-auto shrink-0">
                  <StatusBadge status={c.status} />
                  <CopyButton text={getCallLink(c.room_name)} />
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => joinCall(c)}
                    disabled={joiningId === c.id}
                  >
                    {joiningId === c.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Video className="h-4 w-4" />
                    )}
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Past Consultations */}
      <Card className="border-0 shadow-sm" id="consultations">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Consultation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ended.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No completed consultations yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ended.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-4 rounded-xl border bg-muted/20"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Patient consultation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(c.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {getDuration(c.started_at, c.ended_at) && (
                      <span className="text-xs text-muted-foreground">
                        {getDuration(c.started_at, c.ended_at)}
                      </span>
                    )}
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card className="border-0 shadow-sm" id="profile">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-5 w-5 text-primary" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Full Name", value: profile.full_name },
              { label: "Email", value: profile.email },
              {
                label: "Role",
                value:
                  profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
              },
              { label: "Specialization", value: profile.specialization },
              {
                label: "Experience",
                value: `${profile.years_experience} years`,
              },
              { label: "License Number", value: profile.license_number },
              { label: "Registration Type", value: profile.registration_type },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
            {profile.bio && (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-xs mb-0.5">Bio</p>
                <p className="font-medium leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
