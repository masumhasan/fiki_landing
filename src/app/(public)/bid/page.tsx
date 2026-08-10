import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/custom/section-wrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignaturePad } from "@/components/ui/custom/signature-pad";

export const metadata: Metadata = {
  title: "Background Pull Authorization (BID Form)",
  description:
    "Complete your pre-employment background pull authorization and Background Information Disclosure (BID) form for FIKI Transit.",
};

export default function BidPage() {
  return (
    <SectionWrapper bg="white" padding="md" className="space-y-12">
      <div className="text-center pt-4 md:pt-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-secondary">
          Background Pull Authorization
        </h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <form className="space-y-8">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="First" required />
              <Input placeholder="Last" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <Label>Date of Birth <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-20 px-2"><SelectValue placeholder="MM" /></SelectTrigger>
                  <SelectContent><SelectItem value="01">01</SelectItem></SelectContent>
                </Select>
                -
                <Select>
                  <SelectTrigger className="w-20 px-2"><SelectValue placeholder="DD" /></SelectTrigger>
                  <SelectContent><SelectItem value="01">01</SelectItem></SelectContent>
                </Select>
                -
                <Select>
                  <SelectTrigger className="w-20 px-2"><SelectValue placeholder="YYYY" /></SelectTrigger>
                  <SelectContent><SelectItem value="2000">2000</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            {/* Social Security Number */}
            <div className="flex flex-col gap-2">
              <Label>Social Security Number <span className="text-destructive">*</span></Label>
              <Input placeholder="" required />
            </div>
          </div>

          {/* Driver's License Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Driver&apos;s License Number <span className="text-destructive">*</span></Label>
              <Input placeholder="" required />
            </div>
            <div></div>
          </div>

          {/* Authorization Text */}
          <div className="text-sm text-secondary-foreground leading-relaxed pt-2">
            I authorize Fiki Transit to perform a pre-employment background check using my personal information. I understand that my employment is contingent on passing the background check.
          </div>

          {/* Signature */}
          <div className="flex flex-col gap-2">
            <Label>Signature Here <span className="text-destructive">*</span></Label>
            <SignaturePad />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 pb-10">
            <Button type="submit" variant="action" className="px-8 font-medium">
              SUBMIT FORM
            </Button>
          </div>

        </form>
      </div>
    </SectionWrapper>
  );
}
