import type { Metadata } from "next";
import { DriverRegistrationPortal } from "@/components/portal/DriverRegistrationPortal";
import { DriverAuthGate } from "@/components/auth/DriverAuthGate";

export const metadata: Metadata = {
  title: "Driver Dashboard | FIKI Transit",
  description: "View and track your Wisconsin driver onboarding application status.",
};

export default function DriverDashboardPage() {
  return (
    <DriverAuthGate>
      <DriverRegistrationPortal />
    </DriverAuthGate>
  );
}
