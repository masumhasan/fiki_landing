import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";
import { useFormContext, Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { sanitizePhoneInput } from "@/lib/utils";
import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

export function PassengerInformation() {
  const { control, setValue, watch } = useFormContext();
  const avatarUrl = watch("passengerAvatarUrl");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "passenger-avatars");

    try {
      // NOTE: Adjust API URL based on actual frontend-to-backend URL setup
      // Next.js might rewrite or we might just use the absolute backend URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/upload/public-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setValue("passengerAvatarUrl", data.data.url, { shouldValidate: true });
      } else {
        alert(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SectionCard number="01" title="Passenger Information">
      <div className="flex flex-col gap-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <div 
            className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold">Passenger Avatar (Optional)</h4>
            <p className="text-xs text-muted-foreground mt-1">Click to upload a clear photo of the passenger.</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Full Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Date of Birth <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="date"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Phone Number <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Phone Number"
                  onChange={(e) => field.onChange(sanitizePhoneInput(e.target.value))}
                />
                <p className="mt-1 text-[0.7rem] text-muted-foreground">Only digits (0-9) and &apos;+&apos; sign allowed (e.g. +13125550123)</p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  type="email"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="email@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="emergencyContactName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Emergency Contact Name{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Contact full name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="emergencyContactPhone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Emergency Contact Phone{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Phone Number"
                  onChange={(e) => field.onChange(sanitizePhoneInput(e.target.value))}
                />
                <p className="mt-1 text-[0.7rem] text-muted-foreground">Only digits (0-9) and &apos;+&apos; sign allowed (e.g. +13125550123)</p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="relationship"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Relationship to Passenger <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Parent, Self, Spouse"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
    </SectionCard>
  );
}
