"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationSchema,
  type JobApplicationFormValues,
} from "@/lib/validations/job-application";
import { getPassengerUser } from "@/lib/auth";
import { submitJobApplicationApi } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { PersonalInfoSection } from "./personal-info";
import { JobDetailsSection } from "./job-details";
import { EducationEmploymentSection } from "./education-employment";
import { ReferenceIdentificationSection } from "./reference-identification";
import { UploadSignatureSection } from "./upload-signature";

export function JobApplicationForm({
  prefill,
}: {
  prefill?: { firstName: string; lastName: string; email: string; phone: string } | null;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
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
      driverCategory: "",
      licenseExpirationDate: "",
      socialSecurityNumber: "",
      dobMonth: "",
      dobDay: "",
      dobYear: "",

      signature: "",
    },
  });

  useEffect(() => {
    const user = getPassengerUser();
    if (user && user.role === "DRIVER") {
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      methods.setValue("firstName", firstName);
      methods.setValue("lastName", lastName);
      methods.setValue("email", user.email);
      if (user.phone) methods.setValue("phoneNumber", user.phone);
    } else if (prefill) {
      methods.setValue("firstName", prefill.firstName);
      methods.setValue("lastName", prefill.lastName);
      methods.setValue("email", prefill.email);
      methods.setValue("phoneNumber", prefill.phone);
    }
  }, [methods, prefill]);

  const onSubmit = async (data: JobApplicationFormValues) => {
    setSubmitting(true);
    setSubmitError(null);

    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const positionType = data.position.toLowerCase().includes("wheelchair")
      ? "WHEELCHAIR"
      : data.position.toLowerCase().includes("stretcher")
      ? "STRETCHER"
      : "AMBULATORY";

    const res = await submitJobApplicationApi({
      fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      licenseNumber: data.driversLicenseNumber || "CDL-PENDING",
      positionType,

      streetAddress: data.streetAddress,
      streetAddress2: data.streetAddress2,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country === "US" ? "United States" : data.country === "CA" ? "Canada" : data.country,

      position: data.position,
      availableStartDate: data.availableStartDate,
      employmentStatus: data.status,
      desiredSalary: data.desiredSalary,
      howDidYouHear: data.howDidYouHear,

      authorizedInUS: data.authorizedInUS,
      felonyConviction: data.felonyConviction ? "yes" : "no",
      felonyExplanation: data.felonyConviction || "",

      highSchool: data.highSchool,
      highSchoolGraduated: data.highSchoolGraduated,
      college: data.college,
      collegeGraduated: data.collegeGraduated,
      degree: data.degree,

      previousEmployer: data.previousEmployer,
      jobTitle: data.jobTitle,
      startingSalary: data.startingSalary,
      endingSalary: data.endingSalary,
      responsibilities: data.responsibilities,
      employmentFromDate: data.employmentFromMM && data.employmentFromYYYY ? `${data.employmentFromMM}/${data.employmentFromYYYY}` : "",
      employmentToDate: data.employmentToMM && data.employmentToYYYY ? `${data.employmentToMM}/${data.employmentToYYYY}` : "",
      reasonForLeaving: data.reasonForLeaving,

      referenceName: data.referenceName,
      referenceRelationship: data.referenceRelationship,
      referencePhone: data.referencePhone,

      driverCategory: data.driverCategory,
      licenseExpirationDate: data.licenseExpirationDate,
      socialSecurityNumber: data.socialSecurityNumber,
      dateOfBirth: `${data.dobMonth}/${data.dobDay}/${data.dobYear}`,
      signature: data.signature,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setSubmittedApp(res.data);
    } else {
      setSubmitError(res.error?.message || "Failed to submit job application");
    }
  };

  if (submittedApp) {
    return (
      <div className="py-12 px-6 text-center space-y-6">
        <div className="mx-auto size-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Application Submitted Successfully!</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Thank you for applying for a driver position at FIKI Transit. Your Application ID is{" "}
            <strong className="text-primary font-bold">{submittedApp.applicationId || "APP-2026"}</strong>.
          </p>
        </div>
        <div className="p-6 bg-muted/40 rounded-2xl border border-border text-xs text-muted-foreground max-w-lg mx-auto text-left space-y-2">
          <p className="font-semibold text-foreground">What happens next?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Our fleet management team will review your application details.</li>
            <li>Background checks via CCAP, DOT, and DOJ will be processed.</li>
            <li>Upon approval in the Admin Portal, a vehicle will be assigned to your driver profile.</li>
          </ul>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-secondary/90 transition-colors"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {submitError && (
          <div className="p-4 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl">
            {submitError}
          </div>
        )}

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

        {submitting && (
          <div className="p-4 text-center text-sm font-semibold text-primary bg-primary/10 rounded-2xl">
            Submitting Job Application to Fleet Manager...
          </div>
        )}
      </form>
    </FormProvider>
  );
}
