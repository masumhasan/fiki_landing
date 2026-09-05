import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PassengerSignupForm } from "@/components/auth/PassengerSignupForm";

const portalBenefits = ["Quick Registration", "Instant Quotes", "Safe & Accessible"];

export const metadata: Metadata = {
  title: "Create Passenger Account | FIKI Transit",
  description: "Create a FIKI Transit passenger account to request rides and receive quotes.",
};

export default function PassengerSignupPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-background">
      {/* Left panel */}
      <aside className="fixed inset-y-0 left-0 hidden w-1/2 overflow-hidden bg-secondary text-secondary-foreground lg:block">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 -translate-y-1/3 translate-x-1/3" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/8 translate-y-1/3 -translate-x-1/3" />
        <div className="pointer-events-none absolute right-0 top-[38%] h-20 w-5 rounded-l-full bg-primary/20" />

        <div className="relative z-10 flex h-full flex-col px-[7%] py-[5vh]">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-[15px] bg-card">
              <Image src="/desklogo.png" alt="" width={48} height={48} className="size-10 object-contain" priority />
            </span>
            <div className="leading-none">
              <p className="text-xl font-bold tracking-[-0.02em] text-primary-foreground">FIKI TRANSIT</p>
              <p className="mt-1.5 text-xs font-semibold tracking-[0.16em] text-primary">PASSENGER PORTAL</p>
            </div>
          </Link>

          <div className="mt-[11vh]">
            <h1 className="text-[clamp(2.5rem,4vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.04em]">
              Get Started,
              <span className="mt-2 block text-primary">Passenger</span>
            </h1>
            <p className="mt-6 max-w-md text-[clamp(1rem,1.35vw,1.25rem)] leading-relaxed text-secondary-foreground/70">
              Join FIKI Transit for accessible, non-emergency medical transportation with real-time quote negotiation.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Portal benefits">
              {portalBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-secondary-foreground xl:text-sm"
                >
                  <CheckCircle2 aria-hidden className="size-3.5 text-primary" />
                  {benefit}
                </li>
              ))}
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
          {/* Mobile logo */}
          <Link href="/" className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center rounded-xl bg-muted">
              <Image src="/desklogo.png" alt="" width={48} height={48} className="size-9 object-contain" priority />
            </span>
            <div className="leading-none text-secondary">
              <p className="text-lg font-bold tracking-[-0.02em]">FIKI TRANSIT</p>
              <p className="mt-1.5 text-[0.65rem] font-semibold tracking-[0.16em] text-primary">PASSENGER PORTAL</p>
            </div>
          </Link>

          <div className="my-auto min-w-0 max-w-full">
            <div className="mx-auto w-full max-w-130 rounded-[22px] border border-border bg-card px-6 py-7 sm:px-8 sm:py-8">
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


