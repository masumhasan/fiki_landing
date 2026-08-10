import { z } from "zod";

export const jobApplicationSchema = z.object({
  // Name
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),

  // Address
  streetAddress: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Postal / Zip code is required"),
  country: z.string().min(1, "Country is required"),

  // Contact
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),

  // Application details
  position: z.string().min(1, "Position is required"),
  availableStartDate: z.string().min(1, "Available start date is required"),
  status: z.enum(["Full-Time", "Part-Time", "Either"]),
  desiredSalary: z.string().optional(),
  howDidYouHear: z.string().optional(),

  // Legal / US Auth
  authorizedInUS: z.enum(["yes", "no"]),
  felonyConviction: z.string().optional(),

  // Education
  highSchool: z.string().optional(),
  highSchoolGraduated: z.enum(["yes", "no"]),
  college: z.string().optional(),
  collegeGraduated: z.enum(["yes", "no"]),
  degree: z.string().optional(),

  // Previous Employment
  previousEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  startingSalary: z.string().optional(),
  endingSalary: z.string().optional(),
  responsibilities: z.string().optional(),
  employmentFromMM: z.string().optional(),
  employmentFromDD: z.string().optional(),
  employmentFromYYYY: z.string().optional(),
  employmentToMM: z.string().optional(),
  employmentToDD: z.string().optional(),
  employmentToYYYY: z.string().optional(),
  reasonForLeaving: z.string().optional(),

  // Reference
  referenceName: z.string().optional(),
  referenceRelationship: z.string().optional(),
  referencePhone: z.string().min(10, "Reference phone is required"),

  // License, SSN & DOB
  driversLicenseNumber: z.string().min(1, "Driver's license number is required"),
  socialSecurityNumber: z.string().min(1, "Social security number is required"),
  dobMonth: z.string().min(1, "MM is required"),
  dobDay: z.string().min(1, "DD is required"),
  dobYear: z.string().min(1, "YYYY is required"),

  // Signature
  signature: z.string().min(1, "Signature is required"),
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
