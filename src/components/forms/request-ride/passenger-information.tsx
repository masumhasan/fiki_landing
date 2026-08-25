import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "./section-card";
import { useFormContext, Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function PassengerInformation() {
  const { control } = useFormContext();

  return (
    <SectionCard number="01" title="Passenger Information">
      <div className="flex flex-col gap-6">
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

                <Controller
                  control={control}
                  name="confirmDob"
                  render={({ field: confirmField }) => (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={confirmField.name}
                        checked={confirmField.value}
                        onCheckedChange={confirmField.onChange}
                      />
                      <label
                        htmlFor={confirmField.name}
                        className="text-xs text-muted-foreground leading-none"
                      >
                        I confirm this is the passenger&apos;s correct date of birth
                      </label>
                    </div>
                  )}
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
                  placeholder="(555) 000-0000"
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
                  placeholder="(555) 000-0000"
                />
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
                  Relationship <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
