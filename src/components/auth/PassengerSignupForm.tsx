"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerRiderApi, sendRegistrationOtpApi } from "@/lib/api";
import { savePassengerSession } from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

const CODE_LENGTH = 6;
const DIGIT_IDS = ["first", "second", "third", "fourth", "fifth", "sixth"];

function maskEmail(email: string) {
  if (!email || !email.includes("@")) return email;
  const [name = "user", domain = "email.com"] = email.split("@");
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${"•".repeat(Math.max(3, name.length - visible.length))}@${domain}`;
}

export function PassengerSignupForm() {
  const [step, setStep] = useState<"FORM" | "VERIFY_OTP">("FORM");
  const [savedValues, setSavedValues] = useState<SignupValues | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  async function handleFormSubmit(values: SignupValues) {
    setApiError("");
    setInfoMsg("");

    const res = await sendRegistrationOtpApi(values.email, values.name, "USER");

    if (res.success) {
      setSavedValues(values);
      setOtpCode(Array(CODE_LENGTH).fill(""));
      setStep("VERIFY_OTP");
      setInfoMsg("A 6-digit verification code has been sent to your email.");
    } else {
      setApiError(res.error?.message || "Failed to send verification code. Please try again.");
    }
  }

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpCode((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item))
    );
    if (digit && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const nextCode = Array<string>(CODE_LENGTH).fill("");
    pasted.split("").forEach((digit, index) => {
      nextCode[index] = digit;
    });
    setOtpCode(nextCode);
    inputs.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
  }

  async function handleResendCode() {
    if (!savedValues) return;
    setResending(true);
    setApiError("");
    setInfoMsg("");

    const res = await sendRegistrationOtpApi(savedValues.email, savedValues.name, "USER");
    setResending(false);

    if (res.success) {
      setInfoMsg("A new 6-digit verification code has been sent to your email.");
    } else {
      setApiError(res.error?.message || "Failed to resend verification code.");
    }
  }

  async function handleVerifyAndRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!savedValues) return;

    const codeString = otpCode.join("");
    if (codeString.length !== CODE_LENGTH) {
      setApiError("Please enter all 6 digits of the verification code.");
      return;
    }

    setApiError("");
    setVerifying(true);

    const res = await registerRiderApi(
      savedValues.name,
      savedValues.email,
      savedValues.password,
      savedValues.phone || undefined,
      codeString
    );

    setVerifying(false);

    if (res.success && res.data) {
      savePassengerSession(res.data.user, res.data.token);
      router.replace("/portal");
    } else {
      setApiError(res.error?.message || "Registration failed. Invalid or expired code.");
    }
  }

  if (step === "VERIFY_OTP" && savedValues) {
    return (
      <form onSubmit={handleVerifyAndRegister} className="mt-2 space-y-4">
        <div className="mx-auto flex w-fit max-w-full items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1.5 text-xs text-muted-foreground [&_strong]:truncate [&_strong]:font-bold [&_strong]:text-foreground">
          <Mail aria-hidden="true" className="size-3.5 shrink-0 text-sky-600" />
          <span>Code sent to</span>
          <strong>{maskEmail(savedValues.email)}</strong>
        </div>

        {infoMsg && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-700 flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {apiError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {apiError}
          </div>
        )}

        <div className="pt-2">
          <p className="text-center text-xs text-muted-foreground">
            Enter the 6-digit verification code to verify your identity and activate your account.
          </p>

          <fieldset className="mt-4">
            <legend className="sr-only">6-digit verification code</legend>
            <div className="grid grid-cols-6 gap-2">
              {otpCode.map((digit, index) => (
                <input
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 w-full min-w-0 rounded-xl border border-input bg-muted text-center text-xl font-bold text-foreground outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                  inputMode="numeric"
                  key={DIGIT_IDS[index]}
                  maxLength={1}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !otpCode[index] && index > 0)
                      inputs.current[index - 1]?.focus();
                  }}
                  onPaste={handlePaste}
                  ref={(element) => {
                    inputs.current[index] = element;
                  }}
                  value={digit}
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Didn’t receive the code?</span>
            <button
              className="font-bold text-foreground hover:underline disabled:opacity-50 cursor-pointer"
              type="button"
              disabled={resending}
              onClick={handleResendCode}
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={otpCode.some((digit) => !digit) || verifying}
          className="mt-3 h-12 w-full rounded-full bg-secondary px-5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
        >
          {verifying && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
          {verifying ? "Verifying & Creating Account…" : "Verify & Create Account"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setStep("FORM");
            setApiError("");
            setInfoMsg("");
          }}
          className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground cursor-pointer pt-1"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Edit Registration Details
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-1">
      {apiError && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
          {apiError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          aria-invalid={Boolean(errors.name)}
          className="h-12 w-full rounded-full border border-input bg-muted px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 aria-invalid:border-destructive"
          {...register("name")}
        />
        <p className="mt-1.5 min-h-4 text-xs text-red-600">{errors.name?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reg-email" className="mb-2 block text-sm font-semibold text-foreground">
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          aria-invalid={Boolean(errors.email)}
          className="h-12 w-full rounded-full border border-input bg-muted px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 aria-invalid:border-destructive"
          {...register("email")}
        />
        <p className="mt-1.5 min-h-4 text-xs text-red-600">{errors.email?.message}</p>
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-foreground">
          Phone <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (800) 000-0000"
          className="h-12 w-full rounded-full border border-input bg-muted px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          {...register("phone")}
        />
        <p className="mt-1.5 min-h-4 text-xs text-red-600">{errors.phone?.message}</p>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="reg-password" className="mb-2 block text-sm font-semibold text-foreground">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={Boolean(errors.password)}
            className="h-12 w-full rounded-full border border-input bg-muted px-4 pr-12 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 aria-invalid:border-destructive"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-primary"
          >
            {showPassword ? <EyeOff aria-hidden className="size-4.5" /> : <Eye aria-hidden className="size-4.5" />}
          </button>
        </div>
        <p className="mt-1.5 min-h-4 text-xs text-red-600">{errors.password?.message}</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            className="h-12 w-full rounded-full border border-input bg-muted px-4 pr-12 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 aria-invalid:border-destructive"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-primary"
          >
            {showConfirm ? <EyeOff aria-hidden className="size-4.5" /> : <Eye aria-hidden className="size-4.5" />}
          </button>
        </div>
        <p className="mt-1.5 min-h-4 text-xs text-red-600">{errors.confirmPassword?.message}</p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 h-12 w-full rounded-full bg-secondary px-5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
      >
        {isSubmitting && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        {isSubmitting ? "Sending Verification Code…" : "Continue to Verification"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
}

