"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestRideSchema, type RequestRideFormValues } from "@/lib/validations/request-ride";

import { PassengerInformation } from "./passenger-information";
import { TripInformation } from "./trip-information";
import { MobilityNeeds } from "./mobility-needs";
import { InsurancePayment } from "./insurance-payment";
import { GuardianInformation } from "./guardian-information";
import { ConsentsAgreements } from "./consents-agreements";
import { SignatureSection } from "./signature";

export function RequestRideForm() {
  const methods = useForm({
    resolver: zodResolver(requestRideSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      confirmDob: false,
      phoneNumber: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      relationship: "",

      tripType: "one-way" as const,
      schedule: "one-time" as const,
      pickupAddress: "",
      destinationAddress: "",
      pickupDate: "",
      pickupTime: "",
      appointmentTime: "",

      recurringStartDate: "",
      recurringEndDate: "",
      recurringDays: [] as string[],
      recurringPickupTime: "",
      recurringAppointmentTime: "",

      returnPickupAddress: "",
      returnDestinationAddress: "",
      returnDate: "",
      returnPickupTime: "",
      driverNotes: "",

      mobilityOptions: ["ambulatory"] as string[],
      specialInstructions: "",
      accessInformation: "",

      insuranceName: "",
      authNumber: "",
      privatePay: false,

      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",

      consentPhoto: false,
      consentTransport: false,
      consentEsignature: false,
      consentHipaa: false,

      signatureDate: new Date().toISOString().split("T")[0],
      printedName: "",
      relationshipToPassenger: "",
    },
  });

  const onSubmit = (data: RequestRideFormValues) => {
    console.log("Form submitted successfully:", data);
    alert("Ride request submitted successfully!");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <PassengerInformation />
        <TripInformation />
        <MobilityNeeds />
        <InsurancePayment />
        <GuardianInformation />
        <ConsentsAgreements />
        <SignatureSection />
      </form>
    </FormProvider>
  );
}
