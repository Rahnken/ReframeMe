import {  z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const validationSchema = z.object({
  username: z.string().min(3, { message: "Must have at least 3 characters" }),
  email: z
    .string()
    .min(4, { message: "Must have at least 4 characters" })
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

const validateUsernameSchema = z.string().min(3, { message: "Must have at least 3 characters" });
const validatePasswordSchema = z
.string()
.min(1, { message: "Must have at least 1 character" })
.regex(passwordValidation, {
  message: "Your password must contain at least 1 Capital, 1 lowercase ,1 number and 1 special character",
})
const validateEmailSchema = z.string().email()

export const validateUsernameInput = (username:string) => validateUsernameSchema.safeParse(username)
export const validatePasswordInput = (password:string) => validatePasswordSchema.safeParse(password)
export const validateEmailInput = (email:string) => validateEmailSchema.safeParse(email)

  
