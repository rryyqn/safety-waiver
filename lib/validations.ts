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
    .min(1, "Date of birth is required")
    .refine((date) => {
      const age =
        (new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, "Guardian must be 18 years or older."),
});
