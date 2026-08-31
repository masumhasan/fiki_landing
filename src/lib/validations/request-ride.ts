import { z } from "zod";

export const requestRideSchema = z.object({
  // Passenger Information
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  confirmDob: z.boolean().optional(),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  streetAddress: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  relationship: z.string().min(1, "Relationship is required"),

  // Trip Information
  tripType: z.enum(["one-way", "round-trip"]),
  schedule: z.enum(["one-time", "recurring"]),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  destinationAddress: z.string().min(5, "Destination address is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pickupDate: z.string().optional(),
  pickupTime: z.string().min(1, "Pickup time is required"),
  appointmentTime: z.string().optional().or(z.literal("")).or(z.null()),

  // Recurring Transportation Details
  recurringStartDate: z.string().optional(),
  recurringEndDate: z.string().optional(),
  recurringDays: z.array(z.string()).optional(),
  recurringPickupTime: z.string().optional(),
  recurringAppointmentTime: z.string().optional().or(z.literal("")).or(z.null()),

  // Return Trip Details (Round Trip)
  returnPickupAddress: z.string().optional(),
  returnDestinationAddress: z.string().optional(),
  returnDate: z.string().optional(),
  returnPickupTime: z.string().optional(),
  driverNotes: z.string().optional(),

  // Mobility & Special Needs
  mobilityOptions: z.array(z.string()).optional(),
  specialInstructions: z.string().optional(),
  accessInformation: z.string().optional(),

  // Insurance / Payment
  insuranceName: z.string().optional(),
  authNumber: z.string().optional(),
  privatePay: z.boolean().default(false),

  // Guardian Information
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email("Invalid email").optional().or(z.literal("")),

  // Consents & Agreements
  consentPhoto: z.boolean().refine((val) => val === true, "Required"),
  consentTransport: z.boolean().refine((val) => val === true, "Required"),
  consentEsignature: z.boolean().refine((val) => val === true, "Required"),
  consentHipaa: z.boolean().refine((val) => val === true, "Required"),

  // Signature
  signature: z.string().min(1, "Signature is required"),
  signatureDate: z.string().optional().or(z.literal("")),
  printedName: z.string().min(2, "Printed name is required"),
  relationshipToPassenger: z.string().optional(),
  requestSource: z.string().optional(),
});

export type RequestRideFormValues = z.infer<typeof requestRideSchema>;
