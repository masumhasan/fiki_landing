import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Cta } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "Safe & Reliable Non-Medical Transportation in Madison, WI",
  description:
    "FIKI Transit offers professional non-medical transportation, hospital rides, wheelchair transport, and charter services across Madison and surrounding communities.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Cta />
    </>
  );
}
