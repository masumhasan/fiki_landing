"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationSchema,
  type JobApplicationFormValues,
} from "@/lib/validations/job-application";

import { PersonalInfoSection } from "./personal-info";
import { JobDetailsSection } from "./job-details";
import { EducationEmploymentSection } from "./education-employment";
import { ReferenceIdentificationSection } from "./reference-identification";
import { UploadSignatureSection } from "./upload-signature";

export function JobApplicationForm() {
  const methods = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      zipCode: "",
      country: "US",

      email: "",
      phoneNumber: "",

      position: "Driver (Ambulatory & Wheel-Chair Passengers)",
      availableStartDate: "",
      status: "Full-Time",
      desiredSalary: "",
      howDidYouHear: "",

      authorizedInUS: "yes",
      felonyConviction: "",

      highSchool: "",
      highSchoolGraduated: "yes",
      college: "",
      collegeGraduated: "no",
      degree: "",

      previousEmployer: "",
      jobTitle: "",
      startingSalary: "",
      endingSalary: "",
      responsibilities: "",
      employmentFromMM: "",
      employmentFromDD: "",
      employmentFromYYYY: "",
      employmentToMM: "",
      employmentToDD: "",
      employmentToYYYY: "",
      reasonForLeaving: "",

      referenceName: "",
      referenceRelationship: "",
      referencePhone: "",

      driversLicenseNumber: "",
      socialSecurityNumber: "",
      dobMonth: "",
      dobDay: "",
      dobYear: "",

      signature: "",
    },
  });

  const onSubmit = (data: JobApplicationFormValues) => {
    console.log("Job Application submitted successfully:", data);
    alert("Job Application submitted successfully!");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {/* Top Disclaimer Text */}
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3 p-6 rounded-2xl bg-muted/30 border border-border">
          <p>
            By signing the bottom of this form, you authorize Fiki Transit to contact your references and to use the information provided to conduct background checks through CCAP, the Department of Transportation, and the Department of Justice.
          </p>
          <p>
            Additionally, by signing the form, you certify that the information provided is true and complete to the best of your knowledge. You understand that if this application leads to employment, any false or misleading information provided in this application or during the interview process may result in the termination of your employment with Fiki Transit.
          </p>
        </div>

        <PersonalInfoSection />
        <JobDetailsSection />
        <EducationEmploymentSection />
        <ReferenceIdentificationSection />
        <UploadSignatureSection />
      </form>
    </FormProvider>
  );
}
