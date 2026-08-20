"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, ShieldAlert, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPassengerAuthenticated, getPassengerUser, clearPassengerSession, PassengerUser } from "@/lib/auth";

interface DriverAuthGateProps {
  children: React.ReactNode;
}

export function DriverAuthGate({ children }: DriverAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<PassengerUser | null>(null);

  useEffect(() => {
    const user = getPassengerUser();
    const authed = isPassengerAuthenticated() && user?.role === "DRIVER";
    setCurrentUser(user);
    setChecked(true);
  }, [pathname]);

  const handleLogoutAndSignUpAsDriver = () => {
    clearPassengerSession();
    setCurrentUser(null);
    window.dispatchEvent(new Event("fiki_auth_changed"));
    router.replace(`/driver-signup?redirect=${pathname}`);
  };

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircle className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  // If not authenticated at all
  if (!isPassengerAuthenticated() || !currentUser) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center max-w-md mx-auto my-12">
        <div className="flex justify-center mb-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
            <UserCircle className="size-8 text-secondary" aria-hidden />
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Driver Sign In Required</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need a Driver account to access the driver portal and complete your job application.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/driver-login?redirect=${pathname}`}>
            <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer font-semibold">
              Sign In to Continue
            </Button>
          </Link>
          <Link href={`/driver-signup?redirect=${pathname}`}>
            <Button variant="outline" className="w-full rounded-full cursor-pointer">
              Create Driver Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If logged in but as a Passenger (USER role)
  if (currentUser.role !== "DRIVER") {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center max-w-md mx-auto my-12 space-y-6">
        <div className="mx-auto size-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
          <ShieldAlert className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Rider Account Logged In</h2>
          <p className="text-sm text-muted-foreground">
            You are currently logged in as <strong className="text-foreground">{currentUser.name}</strong>. Rider accounts cannot access the driver registration portal.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            type="button"
            size="lg"
            onClick={handleLogoutAndSignUpAsDriver}
            className="w-full flex items-center justify-center gap-2 bg-[#0E49B8] text-background hover:bg-[#0E49B8]/90 font-bold cursor-pointer rounded-full"
          >
            <LogOut className="size-4" />
            <span>Log Out & Sign Up as Driver</span>
          </Button>
          <Link href="/" className="inline-block text-xs font-semibold text-muted-foreground hover:text-foreground">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
