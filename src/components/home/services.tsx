import { Check } from "lucide-react";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";

const services = [
  {
    title: "Safety",
    description: "Our top priority is ensuring the rider gets to and from there destination safely.",
  },
  {
    title: "Time",
    description: "Our priority is to ensure timely pickups and drop-offs, minimizing wait times and getting riders to their destinations promptly.",
  },
  {
    title: "Affordable",
    description: "Our Rates are the most affordable in the market.",
  },
  {
    title: "Door to Door",
    description: "Driver picks up the rider from the door of their starting location and drops them off at the door of their final destination. This ensures a seamless and convenient experience, particularly for individuals who may need extra assistance.",
  },
];

export function Services() {
  return (
    <SectionWrapper>
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:items-start mb-16">
        <div className="text-center lg:text-left">
          <span className="text-secondary font-bold text-sm tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary mt-2 leading-tight">
            Professional and Compassionate Drivers
          </h2>
        </div>
        <div className="lg:pt-8 text-center lg:text-left">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl lg:mx-0 mx-auto">
            At Fiki Transit, we believe every journey should be accessible, safe, and comfortable. 
            Our mission is to provide reliable transportation services tailored to the needs of 
            individuals with disabilities and mental health conditions, ensuring they have the 
            freedom to move around with ease and confidence.
          </p>
        </div>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {services.map((service, index) => (
          <div 
            key={index}
            className="relative flex flex-col items-center bg-muted/40 rounded-[2.5rem] pt-24 pb-8 px-6 text-center border border-border/30 overflow-hidden shadow-sm"
          >
            {/* White Scoop Curve with Drop Shadow */}
            <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
              <svg 
                viewBox="0 0 100 25" 
                preserveAspectRatio="none" 
                className="w-full h-full fill-background filter drop-shadow-[0_4px_5px_rgba(0,0,0,0.06)]"
              >
                <path d="M0,0 L100,0 L100,6 C75,6 65,24 50,24 C35,24 25,6 0,6 Z" />
              </svg>
            </div>

            {/* Checkmark Icon Container inside the scoop */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 z-10">
              <Check className="w-8 h-8 text-primary stroke-[3.5px]" />
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-1 justify-between mt-4">
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-secondary mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
