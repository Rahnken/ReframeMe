import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const validationSchema = z.object({
  name: z.string().min(1, { message: "Must have at least 1 character" }),
  email: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .email({
      message: "Must be a valid email",
    }),
  password: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .regex(passwordValidation, {
      message: "Your password is not valid",
    }),
});
