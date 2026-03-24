import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Video, Heart } from "lucide-react";

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Heart className="h-4 w-4 fill-current text-green-600 dark:text-green-400" />
          </span>
        </div>

        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground mb-3">
            You are Premium now!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your account has been upgraded. You now have full access to video
            consultations with verified doctors and all premium features.
          </p>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 text-left space-y-3">
          <p className="text-sm font-medium text-foreground">
            What's unlocked:
          </p>
          {[
            "Video calls with verified doctors & counsellors",
            "Priority booking slots",
            "Unlimited AI chat sessions",
            "Advanced mood tracking analytics",
          ].map((feat) => (
            <div
              key={feat}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              {feat}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button asChild size="lg" className="w-full gap-2">
            <Link href="/doctors">
              <Video className="h-4 w-4" />
              Book a Video Consultation
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
