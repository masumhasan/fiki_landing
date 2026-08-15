"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function ReferenceIdentificationSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Reference, Relationship, Phone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          control={control}
          name="referenceName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Reference</FieldLabel>
              <Input
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
          name="referenceRelationship"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Relationship</FieldLabel>
              <Input
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
          name="referencePhone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Phone <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="tel"
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="(201) 555-0123"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </div>

      {/* Driver's License Number, Category, Expiration, SSN, Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          control={control}
          name="driversLicenseNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Drivers License Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
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
          name="driverCategory"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Driver Category</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="CDL-A (Class A)"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="licenseExpirationDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>License Expiration Date</FieldLabel>
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
          name="socialSecurityNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Social Security Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
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

        <div className="space-y-2">
          <FieldLabel>
            Date of Birth <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              control={control}
              name="dobMonth"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="MM" maxLength={2} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="dobDay"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="DD" maxLength={2} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="dobYear"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="YYYY" maxLength={4} />
                </Field>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
