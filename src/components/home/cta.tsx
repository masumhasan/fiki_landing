import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";
import Link from "next/link";

export function Cta() {
  return (
    <SectionWrapper bg="white" padding="md">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
        <Link href="/service-area">
          <Button variant="outline-secondary" size="xl">
            About Services
          </Button>
        </Link>
        <Link href="/request-ride">
          <Button variant="default" size="xl">
            Request A Ride
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
