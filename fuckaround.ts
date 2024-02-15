import { z } from "zod";

const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );
const mySchema = z.string()
const validatePasswordSchema = z
.string()
.min(1, { message: "Must be at least 8 characters" })
.regex(passwordValidation, {
  message: "Your password must contain at least 1 Capital, 1 lowercase ,1 number and 1 special character",
})
const result = mySchema.safeParse("hello")

function check(string:string) {
const result = validatePasswordSchema.safeParse(string);

if(!result.success) return result.error.flatten().formErrors[0]

    return result
} 

console.log(check("p4$$word!?"))
