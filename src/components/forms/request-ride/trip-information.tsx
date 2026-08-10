"use client";

import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "./section-card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const weekDays = [
  { id: "Mon", label: "Mon" },
  { id: "Tue", label: "Tue" },
  { id: "Wed", label: "Wed" },
  { id: "Thu", label: "Thu" },
  { id: "Fri", label: "Fri" },
  { id: "Sat", label: "Sat" },
  { id: "Sun", label: "Sun" },
];

export function TripInformation() {
  const { control } = useFormContext();
  const tripType = useWatch({ control, name: "tripType" });
  const schedule = useWatch({ control, name: "schedule" });

  const isRoundTrip = tripType === "round-trip";
  const isRecurring = schedule === "recurring";

  return (
    <SectionCard number="02" title="Trip Information">
      <div className="flex flex-col gap-8">
        {/* Trip Type Radio Selection */}
        <Controller
          control={control}
          name="tripType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                TRIP TYPE
              </FieldLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                    field.value === "one-way"
                      ? "border-action bg-action/10 text-foreground font-semibold"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value="one-way"
                    checked={field.value === "one-way"}
                    onChange={() => field.onChange("one-way")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      field.value === "one-way"
                        ? "border-action bg-action"
                        : "border-muted-foreground"
                    }`}
                  >
                    {field.value === "one-way" && (
                      <div className="w-2 h-2 rounded-full bg-action-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">One-Way Trip</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                    field.value === "round-trip"
                      ? "border-action bg-action/10 text-foreground font-semibold"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value="round-trip"
                    checked={field.value === "round-trip"}
                    onChange={() => field.onChange("round-trip")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      field.value === "round-trip"
                        ? "border-action bg-action"
                        : "border-muted-foreground"
                    }`}
                  >
                    {field.value === "round-trip" && (
                      <div className="w-2 h-2 rounded-full bg-action-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Round Trip</span>
                </label>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Transportation Schedule Radio Selection */}
        <Controller
          control={control}
          name="schedule"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                TRANSPORTATION SCHEDULE
              </FieldLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                    field.value === "one-time"
                      ? "border-action bg-action/10 text-foreground font-semibold"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value="one-time"
                    checked={field.value === "one-time"}
                    onChange={() => field.onChange("one-time")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      field.value === "one-time"
                        ? "border-action bg-action"
                        : "border-muted-foreground"
                    }`}
                  >
                    {field.value === "one-time" && (
                      <div className="w-2 h-2 rounded-full bg-action-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">One-Time Trip</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                    field.value === "recurring"
                      ? "border-action bg-action/10 text-foreground font-semibold"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value="recurring"
                    checked={field.value === "recurring"}
                    onChange={() => field.onChange("recurring")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      field.value === "recurring"
                        ? "border-action bg-action"
                        : "border-muted-foreground"
                    }`}
                  >
                    {field.value === "recurring" && (
                      <div className="w-2 h-2 rounded-full bg-action-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    Recurring Transportation
                  </span>
                </label>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* DYNAMIC CONTENT AREA BASED ON TRIP TYPE & SCHEDULE */}

        {/* MODE A: ROUND TRIP */}
        {isRoundTrip ? (
          <div className="bg-muted/30 border border-border p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Outbound Trip */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex">
                  <span className="bg-action/10 text-action text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                    OUTBOUND TRIP
                  </span>
                </div>

                <Controller
                  control={control}
                  name="pickupAddress"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Pickup Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter pickup address"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="destinationAddress"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Destination Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter destination address"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="pickupDate"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Pickup Date</FieldLabel>
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
                    name="pickupTime"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Pickup Time</FieldLabel>
                        <Input
                          type="time"
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

                <Controller
                  control={control}
                  name="appointmentTime"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Appointment Time
                      </FieldLabel>
                      <Input
                        type="time"
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

              {/* Right Column: Return Trip */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex">
                  <span className="bg-action/10 text-action text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                    RETURN TRIP
                  </span>
                </div>

                <Controller
                  control={control}
                  name="returnPickupAddress"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Return Pickup Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter return pickup address"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="returnDestinationAddress"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Return Destination Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter return destination"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="returnDate"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Return Date</FieldLabel>
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
                    name="returnPickupTime"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Return Pickup Time
                        </FieldLabel>
                        <Input
                          type="time"
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

                <Controller
                  control={control}
                  name="driverNotes"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Additional Driver Notes
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Any notes for the driver..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          /* MODE B: ONE-WAY TRIP */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Trip Details */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex">
                <span className="bg-action/10 text-action text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                  TRIP DETAILS
                </span>
              </div>

              <Controller
                control={control}
                name="pickupAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Pickup Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter pickup address"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="destinationAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Destination Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter destination address"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="pickupDate"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Pickup Date <span className="text-destructive">*</span>
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
                  name="pickupTime"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Pickup Time <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="time"
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

              <Controller
                control={control}
                name="appointmentTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Appointment Time (Optional)
                    </FieldLabel>
                    <Input
                      type="time"
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

            {/* Right Column: Recurring Transportation Details OR Placeholder Box */}
            {isRecurring ? (
              <div className="flex flex-col gap-6">
                <div className="inline-flex">
                  <span className="bg-action/10 text-action text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                    RECURRING TRANSPORTATION DETAILS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="recurringStartDate"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Start Date <span className="text-destructive">*</span>
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
                    name="recurringEndDate"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          End Date (Optional)
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
                </div>

                {/* Days of Week */}
                <Controller
                  control={control}
                  name="recurringDays"
                  render={({ field, fieldState }) => {
                    const selectedDays: string[] = field.value || [];
                    const toggleDay = (dayId: string) => {
                      if (selectedDays.includes(dayId)) {
                        field.onChange(selectedDays.filter((d) => d !== dayId));
                      } else {
                        field.onChange([...selectedDays, dayId]);
                      }
                    };

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Days of Week</FieldLabel>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {weekDays.map((day) => {
                            const isSelected = selectedDays.includes(day.id);
                            return (
                              <button
                                key={day.id}
                                type="button"
                                onClick={() => toggleDay(day.id)}
                                className={`px-4 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                                  isSelected
                                    ? "border-action bg-action/10 text-foreground font-semibold"
                                    : "border-border hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                {day.label}
                              </button>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="recurringPickupTime"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Pickup Time <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          type="time"
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
                    name="recurringAppointmentTime"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Appointment Time
                        </FieldLabel>
                        <Input
                          type="time"
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
            ) : (
              /* Placeholder box when One-Way + One-Time is selected */
              <div className="min-h-90 flex items-center justify-center p-8 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
                <p className="text-muted-foreground text-sm">
                  Select &quot;Recurring Transportation&quot; to fill these details.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
