"use client";

import { useState } from "react";
import { JobApplicationForm } from "./job-application-form";
import { JobApplicationModal } from "./job-application-modal";

export function JobApplicationView() {
  const [prefill, setPrefill] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null>(null);

  return (
    <>
      <JobApplicationModal onDriverSignupSuccess={(info) => setPrefill(info)} />
      <JobApplicationForm prefill={prefill} />
    </>
  );
}
