import type { Metadata } from "next";
import { PassengerPortal } from "@/components/portal/PassengerPortal";

export const metadata: Metadata = {
  title: "My Portal | FIKI Transit",
  description: "Manage your FIKI Transit ride requests and respond to quote offers from our team.",
};

export default function PortalPage() {
  return <PassengerPortal />;
}
