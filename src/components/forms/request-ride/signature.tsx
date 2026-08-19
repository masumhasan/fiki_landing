"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./section-card";
import { Car, MoveRight, PenTool } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { SignaturePad } from "@/components/ui/custom/signature-pad";

export function SignatureSection() {
  const { control } = useFormContext();

  return (
    <SectionCard number="07" title="Signature">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <Controller
              control={control}
              name="signature"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
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
                </div>
              )}
            />
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              control={control}
              name="signatureDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Date <span className="text-destructive">*</span>
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
              name="printedName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Printed Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Print your full name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="relationshipToPassenger"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Relationship to Passenger
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="If not self"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button type="submit" variant="action" size="xl">
            <Car />
            Request A Ride
            <MoveRight />
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
