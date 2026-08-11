import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";
import { RequestRideForm } from "@/components/forms/request-ride/request-ride-form";
import { AuthGate } from "@/components/auth/AuthGate";

export const metadata: Metadata = {
  title: "Request A Ride",
  description:
    "Book your non-medical medical transportation or private ride online with FIKI Transit. Quick 24-hour booking confirmation and flexible scheduling.",
};

export default function RequestRidePage() {
  return (
    <div className="bg-background min-h-screen">
      <SectionWrapper bg="secondary">
        {/* Header */}
        <div className="text-center mb-12 text-background">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            Request A Ride
          </h1>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto">
          <AuthGate>
            <RequestRideForm />
          </AuthGate>
        </div>
      </SectionWrapper>
    </div>
  );
}
