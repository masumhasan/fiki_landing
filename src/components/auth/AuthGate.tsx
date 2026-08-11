"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPassengerAuthenticated } from "@/lib/auth";

interface AuthGateProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGate({ children, redirectTo = "/login?redirect=/request-ride" }: AuthGateProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = isPassengerAuthenticated();
    setAuthed(ok);
    setChecked(true);
    if (!ok) {
      // slight delay so the "please sign in" prompt is visible rather than instant redirect
    }
  }, []);

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircle className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
            <UserCircle className="size-8 text-secondary" aria-hidden />
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Sign In Required</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need a passenger account to submit a ride request. Your information and quotes will be saved to your portal.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={redirectTo}>
            <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer font-semibold">
              Sign In to Continue
            </Button>
          </Link>
          <Link href="/signup?redirect=/request-ride">
            <Button variant="outline" className="w-full rounded-full cursor-pointer">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
