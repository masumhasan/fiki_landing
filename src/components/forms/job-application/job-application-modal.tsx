"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ArrowLeft, CheckCircle2, ChevronRight, Eye, EyeOff, LoaderCircle, LogOut, Mail, ShieldAlert, UserCheck } from "lucide-react";
import Link from "next/link";
import { clearPassengerSession, getPassengerUser, savePassengerSession, PassengerUser } from "@/lib/auth";
import { registerDriverApi, sendRegistrationOtpApi } from "@/lib/api";
import { sanitizePhoneInput } from "@/lib/utils";

const CODE_LENGTH = 6;
const DIGIT_IDS = ["first", "second", "third", "fourth", "fifth", "sixth"];

function maskEmail(email: string) {
  if (!email || !email.includes("@")) return email;
  const [name = "user", domain = "email.com"] = email.split("@");
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${"•".repeat(Math.max(3, name.length - visible.length))}@${domain}`;
}

export function JobApplicationModal({
  onDriverSignupSuccess,
}: {
  onDriverSignupSuccess?: (info: { firstName: string; lastName: string; email: string; phone: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<PassengerUser | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Step state
  const [modalStep, setModalStep] = useState<"FORM" | "VERIFY_OTP">("FORM");
  const [otpCode, setOtpCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = getPassengerUser();
    setCurrentUser(user);
    if (user && user.role === "DRIVER") {
      setOpen(false); // Already logged in as Driver
    } else {
      setOpen(true);
    }
  }, []);

  const handleLogoutAndSignUpAsDriver = () => {
    clearPassengerSession();
    setCurrentUser(null);
    window.dispatchEvent(new Event("fiki_auth_changed"));
    setModalStep("FORM");
    setOpen(true);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email address is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the Terms & Conditions";
    if (!agreePrivacy) newErrors.agreePrivacy = "You must agree to the Privacy Policy";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await sendRegistrationOtpApi(email.trim(), fullName, "DRIVER");

    setSubmitting(false);

    if (!res.success) {
      const msg = res.error?.message || "Failed to send verification code";
      setErrors({ form: msg });
      return;
    }

    setOtpCode(Array(CODE_LENGTH).fill(""));
    setInfoMsg("A 6-digit verification code has been sent to your email.");
    setModalStep("VERIFY_OTP");
  };

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpCode((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item))
    );
    if (digit && index < CODE_LENGTH - 1) otpInputs.current[index + 1]?.focus();
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
    otpInputs.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
  }

  async function handleResendOtp() {
    setResendingOtp(true);
    setErrors({});
    setInfoMsg("");

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await sendRegistrationOtpApi(email.trim(), fullName, "DRIVER");
    setResendingOtp(false);

    if (res.success) {
      setInfoMsg("A new 6-digit verification code has been sent to your email.");
    } else {
      setErrors({ form: res.error?.message || "Failed to resend verification code." });
    }
  }

  async function handleVerifyOtpAndRegister(e: React.FormEvent) {
    e.preventDefault();
    const codeString = otpCode.join("");
    if (codeString.length !== CODE_LENGTH) {
      setErrors({ form: "Please enter all 6 digits of the verification code." });
      return;
    }

    setErrors({});
    setVerifyingOtp(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await registerDriverApi(fullName, email.trim(), password, phone.trim(), codeString);

    setVerifyingOtp(false);

    if (!res.success) {
      const msg = res.error?.message || "Invalid or expired verification code";
      setErrors({ form: msg });
      return;
    }

    // Save driver session (User Role: DRIVER)
    if (res.data?.user && res.data?.token) {
      savePassengerSession(res.data.user, res.data.token);
      window.dispatchEvent(new Event("fiki_auth_changed"));
    }

    if (onDriverSignupSuccess) {
      onDriverSignupSuccess({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
    }

    setOpen(false);
  }

  // Render view when user is logged in as rider (USER role)
  const isRiderLoggedIn = currentUser && currentUser.role !== "DRIVER";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl h-[70dvh] md:h-auto overflow-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Job Application Screening</DialogTitle>
        </DialogHeader>

        {isRiderLoggedIn ? (
          <div className="py-6 px-4 space-y-6 text-center">
            <div className="mx-auto size-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="size-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Rider Account Logged In</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You are currently logged in as <strong className="text-foreground">{currentUser.name}</strong> ({currentUser.email}) with User Role: <span className="uppercase text-secondary font-semibold">{currentUser.role}</span>.
              </p>
            </div>

            <div className="p-4 bg-muted/40 rounded-2xl border border-border text-xs text-muted-foreground text-left space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <UserCheck className="size-4 text-primary" /> Driver Sign-Up Required
              </p>
              <p>
                To submit a Driver Job Application, you must first log out of your rider account, sign up for a Driver account (User Role: DRIVER), and complete the driver registration form.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="button"
                size="lg"
                onClick={handleLogoutAndSignUpAsDriver}
                className="w-full flex items-center justify-center gap-2 bg-[#0E49B8] text-background hover:bg-[#0E49B8]/90 font-bold cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Log Out & Sign Up as Driver</span>
              </Button>
              <Link href="/" className="inline-block text-xs font-semibold text-muted-foreground hover:text-foreground">
                ← Return to Home
              </Link>
            </div>
          </div>
        ) : modalStep === "VERIFY_OTP" ? (
          <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6 py-2">
            <div className="text-center space-y-1 pt-2">
              <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit verification code to activate your driver partner account.
              </p>
            </div>

            <div className="mx-auto flex w-fit max-w-full items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1.5 text-xs text-muted-foreground [&_strong]:truncate [&_strong]:font-bold [&_strong]:text-foreground">
              <Mail aria-hidden="true" className="size-3.5 shrink-0 text-sky-600" />
              <span>Code sent to</span>
              <strong>{maskEmail(email)}</strong>
            </div>

            {infoMsg && (
              <div className="p-3 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
                <span>{infoMsg}</span>
              </div>
            )}

            {errors.form && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {errors.form}
              </div>
            )}

            <fieldset className="mt-2">
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
                        otpInputs.current[index - 1]?.focus();
                    }}
                    onPaste={handlePaste}
                    ref={(element) => {
                      otpInputs.current[index] = element;
                    }}
                    value={digit}
                  />
                ))}
              </div>
            </fieldset>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Didn’t receive the code?</span>
              <button
                className="font-bold text-foreground hover:underline disabled:opacity-50 cursor-pointer"
                type="button"
                disabled={resendingOtp}
                onClick={handleResendOtp}
              >
                {resendingOtp ? "Sending..." : "Resend Code"}
              </button>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                size="lg"
                disabled={otpCode.some((d) => !d) || verifyingOtp}
                className="w-full flex items-center justify-center gap-2 bg-[#0E49B8] text-background hover:bg-[#0E49B8]/90 font-bold cursor-pointer"
              >
                {verifyingOtp && <LoaderCircle className="size-4 animate-spin" />}
                <span>{verifyingOtp ? "Verifying & Registering..." : "Verify & Continue to Application"}</span>
                <ChevronRight className="size-4" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  setModalStep("FORM");
                  setErrors({});
                  setInfoMsg("");
                }}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground cursor-pointer pt-1"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" /> Edit Registration Details
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleContinue} className="space-y-6">
            {/* Header / Notice */}
            <div className="text-center space-y-1 pt-2">
              <h2 className="text-2xl font-bold text-foreground">Driver Account Registration</h2>
              <p className="text-xs text-muted-foreground">
                Sign up as a Driver (Role: DRIVER) to complete your job application.
              </p>
            </div>

            {errors.form && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {errors.form}
              </div>
            )}

            {/* PERSONAL INFORMATION DIVIDER */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative bg-popover px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                PERSONAL INFORMATION
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="modal-firstName">
                  First Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="modal-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
                {errors.firstName && (
                  <FieldError errors={[{ message: errors.firstName }]} />
                )}
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="modal-lastName">
                  Last Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="modal-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <FieldError errors={[{ message: errors.lastName }]} />
                )}
              </Field>
            </div>

            {/* Email Address */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="modal-email">
                Email Address <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@email.com"
              />
              {errors.email && (
                <FieldError errors={[{ message: errors.email }]} />
              )}
            </Field>

            {/* Phone Number */}
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="modal-phone">
                Phone Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="modal-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                placeholder="Phone Number"
              />
              <p className="mt-1 text-[0.7rem] text-muted-foreground">Only digits (0-9) and &apos;+&apos; sign allowed (e.g. +13125550123)</p>
              {errors.phone && (
                <FieldError errors={[{ message: errors.phone }]} />
              )}
            </Field>

            {/* ACCOUNT INFORMATION DIVIDER */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative bg-popover px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                DRIVER ACCOUNT INFORMATION (ROLE: DRIVER)
              </div>
            </div>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="modal-password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="modal-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <FieldError errors={[{ message: errors.password }]} />
              )}
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="modal-confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="modal-confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <FieldError errors={[{ message: errors.confirmPassword }]} />
              )}
            </Field>

            {/* SECURITY & AGREEMENTS DIVIDER */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative bg-popover px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                SECURITY & AGREEMENTS
              </div>
            </div>

            {/* Agreements Checkboxes */}
            <div className="space-y-3">
              <Field data-invalid={!!errors.agreeTerms}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeTerms}
                    onCheckedChange={(val) => setAgreeTerms(!!val)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-muted-foreground leading-normal cursor-pointer">
                    I agree to the{" "}
                    <Link href="#" className="text-secondary hover:underline font-medium">
                      Terms & Conditions
                    </Link>{" "}
                    of <strong className="text-foreground font-semibold">fikitransit.com</strong> driver program.
                  </label>
                </div>
                {errors.agreeTerms && (
                  <FieldError errors={[{ message: errors.agreeTerms }]} />
                )}
              </Field>

              <Field data-invalid={!!errors.agreePrivacy}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreePrivacy"
                    checked={agreePrivacy}
                    onCheckedChange={(val) => setAgreePrivacy(!!val)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agreePrivacy" className="text-xs text-muted-foreground leading-normal cursor-pointer">
                    I have read and agree to the{" "}
                    <Link href="#" className="text-secondary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                    , including HIPAA data handling requirements.
                  </label>
                </div>
                {errors.agreePrivacy && (
                  <FieldError errors={[{ message: errors.agreePrivacy }]} />
                )}
              </Field>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button type="submit" size="lg" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-[#0E49B8] text-background cursor-pointer">
                <span>{submitting ? "Creating Driver Account..." : "Continue to Driver Application"}</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-muted-foreground">
                Already have a driver account?{" "}
                <Link href="/login?redirect=/job-application" className="text-secondary hover:underline font-bold">
                  Log In
                </Link>
              </span>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
