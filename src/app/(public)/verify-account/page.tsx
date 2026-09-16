import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VerificationForm } from "@/components/auth/VerificationForm";

export const metadata: Metadata = {
  title: "Verify Account | FIKI Transit Passenger Portal",
  description: "Verify your OTP code to reset your password.",
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function PassengerVerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 transition-opacity hover:opacity-90" aria-label="FIKI Transit Home">
            <span className="grid size-11 place-items-center rounded-xl border border-border/80 bg-card p-1 shadow-xs">
              <Image src="/fiki-logo.png" alt="FIKI Transit" width={44} height={44} className="size-8 object-contain" />
            </span>
            <span className="text-lg font-black tracking-[-0.03em] text-secondary">FIKI TRANSIT</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Verify Account</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter the 6-digit code sent to your email to verify your identity.
          </p>
        </div>
        <VerificationForm email={email} />
      </div>
    </main>
  );
}
