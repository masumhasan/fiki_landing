"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { sanitizePhoneInput } from "@/lib/utils";

export function GuardianInformation() {
  const { control } = useFormContext();

  return (
    <SectionCard number="05" title="Guardian Information (If Applicable)">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Controller
          control={control}
          name="guardianName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Guardian Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Full Name"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="guardianPhone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Guardian Phone Number</FieldLabel>
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
          name="guardianEmail"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Guardian Email (Optional)</FieldLabel>
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
    </SectionCard>
  );
}
