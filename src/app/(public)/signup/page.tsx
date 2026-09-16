import { Calendar, FileText, Lock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PassengerSignupForm } from "@/components/auth/PassengerSignupForm";

const portalBenefits = [
  { label: "Secure Booking", icon: Lock },
  { label: "Real-Time Quotes", icon: FileText },
  { label: "Easy Ride Management", icon: Calendar },
];

export const metadata: Metadata = {
  title: "Create Passenger Account | FIKI Transit",
  description: "Create a FIKI Transit passenger account to request rides and receive quotes.",
};

function Brand() {
  return (
    <Link
      href="/"
      className="group flex flex-col items-center text-center transition-opacity hover:opacity-90"
      aria-label="FIKI Transit Home"
    >
      <Image
        src="/fiki-logo.png"
        alt="FIKI Transit Logo"
        width={80}
        height={80}
        className="size-16 sm:size-20 object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
        priority
      />
      <div className="mt-2.5 leading-none">
        <p className="text-xl font-black tracking-[-0.03em] text-secondary sm:text-[22px]">
          FIKI TRANSIT
        </p>
        <p className="mt-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">
          PASSENGER PORTAL
        </p>
      </div>
    </Link>
  );
}

export default function PassengerSignupPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-background">
      {/* Left panel */}
      <aside className="fixed inset-y-0 left-0 hidden w-1/2 overflow-hidden bg-secondary text-secondary-foreground lg:block">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 -translate-y-1/3 translate-x-1/3" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/8 translate-y-1/3 -translate-x-1/3" />
        <div className="pointer-events-none absolute right-0 top-[38%] h-20 w-5 rounded-l-full bg-primary/20" />

        <div className="relative z-10 flex h-full flex-col px-[7%] py-[6vh]">
          <div className="mt-[4vh] xl:mt-[6vh]">
            <h1 className="text-[clamp(2.5rem,4vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white">
              Welcome to
              <span className="mt-2 block text-primary">FIKI Transit</span>
            </h1>
            <p className="mt-5 max-w-md text-[clamp(1rem,1.3vw,1.2rem)] font-medium leading-relaxed text-secondary-foreground/90">
              A simple way to book rides, view real-time quotes, and manage transportation requests.
            </p>
            <p className="mt-3 max-w-md text-[clamp(0.875rem,1.1vw,1rem)] leading-relaxed text-secondary-foreground/70">
              For passengers, family members, case managers, guardians, and IRIS consultants.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5 xl:gap-3" aria-label="Portal benefits">
              {portalBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.label}
                    className="flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs xl:text-sm"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-secondary">
                      <Icon aria-hidden className="size-3.5 stroke-[2.5]" />
                    </span>
                    <span>{benefit.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <Image
            src="/car.png"
            alt="FIKI Transit accessible vehicle"
            width={420}
            height={298}
            className="absolute bottom-[3vh] left-1/2 h-auto w-[52%] max-w-90 -translate-x-1/2 drop-shadow-2xl"
            priority
          />
        </div>
      </aside>

      {/* Right panel */}
      <section className="min-h-svh max-w-full overflow-x-hidden overflow-y-auto lg:ml-[50%]">
        <div className="flex min-h-full flex-col px-5 py-5 sm:px-8 lg:px-10 lg:py-7 xl:px-14">
          <div className="my-auto min-w-0 max-w-full py-6">
            <div className="mx-auto mb-6 flex w-full max-w-130 justify-center">
              <Brand />
            </div>

            <div className="mx-auto w-full max-w-130 rounded-[22px] border border-border bg-card px-6 py-7 sm:px-8 sm:py-8 shadow-xs">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Create Account</h2>
                <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                  Set up your passenger account to start requesting rides
                </p>
              </div>
              <PassengerSignupForm />
            </div>

            <footer className="mx-auto mt-5 w-full max-w-130 text-center text-xs text-muted-foreground">
              <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
                <a className="transition-colors hover:text-primary" href="/privacy">Privacy Policy</a>
                <span aria-hidden>•</span>
                <a className="transition-colors hover:text-primary" href="/terms">Terms of Service</a>
                <span aria-hidden>•</span>
                <a className="transition-colors hover:text-primary" href="/help-center">Help Center</a>
              </nav>
              <p className="mt-2 text-muted-foreground/60">
                © {new Date().getFullYear()} FIKI Transit. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
