"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "./section-card";
import { Check } from "lucide-react";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

const mobilityOptionsList = [
  { id: "ambulatory", label: "Ambulatory" },
  { id: "wheelchair", label: "Wheelchair" },
  { id: "walker", label: "Walker" },
  { id: "cane", label: "Cane" },
];

export function MobilityNeeds() {
  const { control } = useFormContext();

  return (
    <SectionCard number="03" title="Mobility & Special Needs">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <Controller
            control={control}
            name="mobilityOptions"
            render={({ field, fieldState }) => {
              const selectedValues: string[] = field.value || [];

              const toggleOption = (id: string) => {
                if (selectedValues.includes(id)) {
                  field.onChange(selectedValues.filter((item) => item !== id));
                } else {
                  field.onChange([...selectedValues, id]);
                }
              };

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Select all that apply</FieldLabel>
                  <FieldDescription>
                    Choose all equipment, assistance, or accommodations needed.
                  </FieldDescription>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {mobilityOptionsList.map((option) => {
                      const isChecked = selectedValues.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors text-sm font-medium ${
                            isChecked
                              ? "border-action bg-action/10 text-foreground font-semibold"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isChecked}
                            onChange={() => toggleOption(option.id)}
                          />
                          {isChecked && <Check className="w-4 h-4 text-action stroke-[3px]" />}
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <Controller
            control={control}
            name="specialInstructions"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Special Instructions
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Describe any special transportation requirements..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="accessInformation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Access Information
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Describe access details (e.g., elevator required, gate code)..."
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
