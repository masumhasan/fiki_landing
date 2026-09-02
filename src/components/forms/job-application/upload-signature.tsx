"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/ui/custom/signature-pad";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function UploadSignatureSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      {/* Background Authorization Checkbox */}
      <Controller
        control={control}
        name="authorizeBackgroundCheck"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-start space-x-2 rounded-xl border border-border p-4 bg-muted/10 shadow-sm">
              <Checkbox
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-foreground cursor-pointer select-none"
                >
                  I Authorize Fiki Transit to pull my background data
                </label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, you authorize Fiki Transit to perform a background search as part of your employment application.
                </p>
              </div>
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* Signature */}
      <Controller
        control={control}
        name="signature"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Signature Here <span className="text-destructive">*</span>
            </FieldLabel>
            <SignaturePad
              value={field.value}
              onChange={field.onChange}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <div>
          <Button type="submit" variant="action" size="xl">
            Apply For The Job
          </Button>
        </div>
      </div>
    </div>
  );
}
