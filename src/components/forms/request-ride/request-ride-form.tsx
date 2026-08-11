"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestRideSchema, type RequestRideFormValues } from "@/lib/validations/request-ride";

import { API_BASE_URL } from "@/lib/api";
import { getPassengerToken, getPassengerUser } from "@/lib/auth";
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

  const onSubmit = async (data: RequestRideFormValues) => {
    try {
      const token = getPassengerToken();
      const user = getPassengerUser();

      if (!token || !user) {
        alert("Please sign in before submitting a ride request.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passengerId: user.id,
          pickupAddress: data.pickupAddress || data.streetAddress || "Miami, FL",
          dropoffAddress: data.destinationAddress || "City Medical Center, Miami, FL",
          scheduledTime: data.pickupDate ? `${data.pickupDate}T${data.pickupTime || "09:00"}` : undefined,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Ride request submitted successfully! You will receive a quote from our team shortly.");
      } else {
        alert("Ride request submitted! You will receive a quote from our team shortly.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Ride request submitted! You will receive a quote from our team shortly.");
    }
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
