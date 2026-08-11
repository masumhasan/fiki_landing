"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerRiderApi } from "@/lib/api";
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

export function PassengerSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  async function handleSignup(values: SignupValues) {
    setApiError("");
    const res = await registerRiderApi(values.name, values.email, values.password, values.phone || undefined);

    if (res.success && res.data) {
      savePassengerSession(res.data.user, res.data.token);
      router.replace("/portal");
    } else {
      setApiError(res.error?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignup)} noValidate className="space-y-1">
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
          placeholder="+1 (608) 000-0000"
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
        {isSubmitting ? "Creating Account…" : "Create Passenger Account"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
