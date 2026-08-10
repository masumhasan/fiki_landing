import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";

export function Hero() {
  return (
    <SectionWrapper padding="sm" bg="secondary" className="text-secondary-foreground relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Text Content */}
        <div className="flex flex-col items-center text-center lg:text-left space-y-6">
          <h1 className="text-4xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Welcome
          </h1>
          <div className="space-y-2 text-xl md:text-3xl font-medium leading-snug text-center">
            <p>NON Emergency Ambulatory Services</p>
            <p>Disabled Senior Adults & Children.</p>
            <p>Special Needs Adults & Children.</p>
          </div>

          <div className="pt-4">
            <Link
              href="/request-ride"
            >
              <Button size="xl">
                Request A Ride
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative w-full h-75 md:h-100 flex justify-center items-center">
          <div className="relative w-full h-full">
            {/* Note: Update the src to your actual van image path in the public folder */}
            <Image
              src="/car.png"
              alt="Fiki Transit Accessible Car"
              fill
              className="object-contain drop-shadow-2xl scale-100 lg:scale-[1.1]"
              priority
            />
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
