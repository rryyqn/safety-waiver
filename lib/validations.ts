import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const guardianSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number is invalid")
    .max(15, "Phone number is invalid")
    .pipe(z.coerce.number("Phone number is invalid")),
  dob: z
    .date("Date of birth is invalid")
    .min(new Date("1900-01-01"), "Date of birth is invalid")
    .max(new Date(), { message: "Date of birth cannot be in the future" })
    .refine((date) => {
      const age =
        (new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, "Guardian must be 18 years or older"),
});

export const childSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z
    .date("Date of birth is invalid")
    .min(new Date("1900-01-01"), "Date of birth is invalid")
    .max(new Date(), { message: "Date of birth cannot be in the future" })
    .refine((date) => {
      const age =
        (new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);
      return age <= 18;
    }, "Child must be 18 years or younger"),
});

export const childrenArraySchema = z
  .array(childSchema)
  .min(1, "At least one child is required");

export const agreementSchema = z
  .object({
    guardianName: z.string().min(1, "Guardian name is required"),
    signature: z.string().min(1, "Signature is required"),
    rulesAgreement: z
      .boolean()
      .refine((val) => val === true, "Agreement required"),
    risksAgreement: z
      .boolean()
      .refine((val) => val === true, "Agreement required"),
    medicalAgreement: z
      .boolean()
      .refine((val) => val === true, "Agreement required"),
  })
  .refine((data) => data.signature.trim() === data.guardianName.trim(), {
    message: "Signature must exactly match your full name",
    path: ["signature"],
  });
