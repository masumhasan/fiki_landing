"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function EducationEmploymentSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* High School & College */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Controller
            control={control}
            name="highSchool"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>High School</FieldLabel>
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
            name="highSchoolGraduated"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Did you graduate? <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value="yes"
                      checked={field.value === "yes"}
                      onChange={() => field.onChange("yes")}
                      className="accent-secondary"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value="no"
                      checked={field.value === "no"}
                      onChange={() => field.onChange("no")}
                      className="accent-secondary"
                    />
                    <span>No</span>
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="space-y-4">
          <Controller
            control={control}
            name="college"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>College</FieldLabel>
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
            name="collegeGraduated"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Did you graduate? <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value="yes"
                      checked={field.value === "yes"}
                      onChange={() => field.onChange("yes")}
                      className="accent-secondary"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value="no"
                      checked={field.value === "no"}
                      onChange={() => field.onChange("no")}
                      className="accent-secondary"
                    />
                    <span>No</span>
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      {/* Degree */}
      <Controller
        control={control}
        name="degree"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Degree</FieldLabel>
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

      {/* Previous Employer */}
      <Controller
        control={control}
        name="previousEmployer"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Previous Employer</FieldLabel>
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

      {/* Job Title, Starting Salary, Ending Salary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          control={control}
          name="jobTitle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Job Title</FieldLabel>
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
          name="startingSalary"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Starting Salary</FieldLabel>
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
          name="endingSalary"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ending Salary</FieldLabel>
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
      </div>

      {/* Responsibilities */}
      <Controller
        control={control}
        name="responsibilities"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Responsibilities</FieldLabel>
            <Textarea
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

      {/* Employment Dates & Reason for Leaving */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* From MM DD YYYY */}
        <div className="space-y-2">
          <FieldLabel>From</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              control={control}
              name="employmentFromMM"
              render={({ field }) => (
                <Input {...field} placeholder="MM" maxLength={2} />
              )}
            />
            <Controller
              control={control}
              name="employmentFromDD"
              render={({ field }) => (
                <Input {...field} placeholder="DD" maxLength={2} />
              )}
            />
            <Controller
              control={control}
              name="employmentFromYYYY"
              render={({ field }) => (
                <Input {...field} placeholder="YYYY" maxLength={4} />
              )}
            />
          </div>
        </div>

        {/* To MM DD YYYY */}
        <div className="space-y-2">
          <FieldLabel>To</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              control={control}
              name="employmentToMM"
              render={({ field }) => (
                <Input {...field} placeholder="MM" maxLength={2} />
              )}
            />
            <Controller
              control={control}
              name="employmentToDD"
              render={({ field }) => (
                <Input {...field} placeholder="DD" maxLength={2} />
              )}
            />
            <Controller
              control={control}
              name="employmentToYYYY"
              render={({ field }) => (
                <Input {...field} placeholder="YYYY" maxLength={4} />
              )}
            />
          </div>
        </div>

        {/* Reason for Leaving */}
        <Controller
          control={control}
          name="reasonForLeaving"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Reason for Leaving</FieldLabel>
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
      </div>
    </div>
  );
}
