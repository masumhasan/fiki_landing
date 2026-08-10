"use client";

import { useState } from "react";
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
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import Link from "next/link";

export function JobApplicationModal() {
  const [open, setOpen] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email address is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the Terms & Conditions";
    if (!agreePrivacy) newErrors.agreePrivacy = "You must agree to the Privacy Policy";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl h-[70dvh] md:h-auto overflow-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Job Application Screening</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleContinue} className="space-y-6">
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
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
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
              ACCOUNT INFORMATION
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  className="mt-0.5"
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
                  className="mt-0.5"
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
            <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2 bg-[#0E49B8] text-background">
              <span>Continue to Driver Application</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
