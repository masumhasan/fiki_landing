import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";
import { JobApplicationView } from "@/components/forms/job-application/job-application-view";
import { DriverAuthGate } from "@/components/auth/DriverAuthGate";

export const metadata: Metadata = {
  title: "Driver & Career Job Application",
  description:
    "Apply for driver, dispatcher, and administrative positions at FIKI Transit. Join our dedicated non-medical transportation team in Wisconsin.",
};

export default function JobApplicationPage() {
  return (
    <div className="bg-background min-h-screen">
      <SectionWrapper bg="secondary">
        {/* Header */}
        <div className="text-center mb-12 text-background">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Job Application Form
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            Thank you for your interest in joining our team. Please submit your application by completing the Job Application Form.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto bg-card text-card-foreground p-6 md:p-10 rounded-3xl border border-border shadow-xs">
          <DriverAuthGate>
            <JobApplicationView />
          </DriverAuthGate>
        </div>
      </SectionWrapper>
    </div>
  );
}
