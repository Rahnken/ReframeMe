
import { z } from 'zod';

// Define a schema for the sign-in request
const SignInRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});
const createUserRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})
.strict()


// Assuming the response includes a token and userInfo, define a schema for that
export const SignInResponseSchema = z.object({
  token: z.string(),
  userInfo: z.object({
    email: z.string(), 
    username: z.string(),
    lastLogin: z.string().datetime()
  }),
  message: z.string().optional(), // Assuming the message might be included in the response
});

// Type aliases for TypeScript
type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof SignInResponseSchema>

export type {SignInRequest,SignInResponse,UserCreateRequest,User}


const BASE_URL = "http://localhost:4000/user"
export const signInUser = async (
  body: SignInRequest
): Promise<SignInResponse> => {
  // Validate request body against SignInRequestSchema
  const result = SignInRequestSchema.safeParse(body);
  if (!result.success) {
    throw new Error("Invalid request data");
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(result.data), // Use validated data
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  console.log(responseData)
  // Optionally, validate the response format here if needed
  const responseValidation = SignInResponseSchema.safeParse(responseData);
  
  if (!responseValidation.success) {
    console.log(responseValidation.error)
    throw new Error(responseData.message);
  }

  return responseValidation.data;
};

export const createUser = async (
  body:UserCreateRequest
):Promise<unknown> =>
{
  const result = createUserRequestSchema.safeParse(body);
  if(!result.success) throw new Error("invalid request data")

  const response = await fetch(`${BASE_URL}/register`,{
    method:"POST",
    body:JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
  })
 return await response.json()
  
}
