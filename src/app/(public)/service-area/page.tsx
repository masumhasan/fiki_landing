import type { Metadata } from "next";
import { Check } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";

export const metadata: Metadata = {
  title: "Our Service Area",
  description:
    "Explore FIKI Transit's coverage area across Dane County including Madison, Sun Prairie, Middleton, Verona, Waunakee, Oregon, and surrounding Wisconsin communities.",
};

export default function ServiceAreaPage() {
  const areas = [
    "Cottage Grove Area",
    "Deforest Area",
    "Lodi Area",
    "Madison Area",
    "Middleton Area",
    "Mt Horeb Area",
    "Oregon Area",
    "Sauk City Area",
    "Stoughton Area",
    "Sun Prairie Area",
    "Verona Area",
    "Waunakee Area",
  ];

  return (
    <div className="flex flex-col w-full py-12 lg:py-18">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-semibold mb-8 tracking-tight">
          Our Service Area
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-loose px-4">
          We strive to provide safe, reliable, and cost effective non-medical and
          mobility transportation to hospitals, nursing homes, rehabilitation facilities,
          assisted living homes, hospice providers, company events, airport business
          trips, wedding charters and private citizens in Madison and surrounding
          area communities including:
        </p>
      </div>

      {/* Service Area Section (Full Width Screen) */}
      <div className="w-[97%] mx-auto rounded-2xl relative overflow-hidden bg-linear-to-b from-[#111d23] via-[#1a2d3d] to-[#2e4661]">
        <SectionWrapper className="text-white">
          <div>
            {/* Subtitle */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">
              Coverage Regions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Van Image using Next.js Image */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full aspect-8/5">
                  <Image
                    src="/service-car.png"
                    alt="FIKI Transit Accessible Service Car"
                    fill
                    className="object-contain drop-shadow-2xl scale-110 origin-right"
                    priority
                  />
                </div>
              </div>

              {/* Right: Area List */}
              <div className="flex justify-center md:justify-start lg:pl-12">
                <ul className="space-y-4">
                  {areas.map((area, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-primary stroke-[3px]" />
                      <span className="text-base md:text-lg font-medium tracking-wide text-primary">
                        {area}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}
