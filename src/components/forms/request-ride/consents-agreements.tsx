"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionCard } from "./section-card";
import { Field, FieldError, FieldDescription } from "@/components/ui/field";

export function ConsentsAgreements() {
  const { control } = useFormContext();

  return (
    <SectionCard number="06" title="Consents & Agreements">
      <div className="flex flex-col gap-4">
        <FieldDescription>
          By checking each box, you acknowledge and agree to the following:
        </FieldDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="consentPhoto"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-border bg-muted/30">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Passenger Photo Authorization <span className="text-destructive">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I authorize FIKI Transit to use the passenger&apos;s photo for identification and safety purposes.
                    </p>
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="consentTransport"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-border bg-muted/30">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Passenger Transportation Agreement <span className="text-destructive">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I agree to the terms and conditions governing non-emergency medical transportation services.
                    </p>
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="consentEsignature"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-border bg-muted/30">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Passenger Electronic Signature Consent <span className="text-destructive">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I consent to the use of electronic signatures in place of traditional wet signatures.
                    </p>
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="consentHipaa"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-border bg-muted/30">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      FIKI Transit Privacy Policy (HIPAA Notice) <span className="text-destructive">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I acknowledge receipt of the HIPAA Notice of Privacy Practices and consent to its terms.
                    </p>
                  </div>
                </div>
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
