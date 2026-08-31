import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | FIKI Transit Passenger Portal",
  description: "Request a password reset verification code for your FIKI Transit account.",
};

export default function PassengerForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <span className="grid size-11 place-items-center rounded-xl bg-muted">
              <Image src="/desklogo.png" alt="" width={44} height={44} className="size-9 object-contain" />
            </span>
            <span className="text-lg font-bold tracking-[-0.02em] text-secondary">FIKI TRANSIT</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter your email address and we will send you a 6-digit verification code to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
