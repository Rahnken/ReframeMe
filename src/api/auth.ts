
import { z } from 'zod';

// Define a schema for the sign-in request
const SignInRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Assuming the response includes a token and userInfo, define a schema for that
export const SignInResponseSchema = z.object({
  token: z.string(),
  userInfo: z.object({
    email: z.string().optional(), // Make it optional if it might not always be present
    // Add other user info fields as needed
  }),
  message: z.string().optional(), // Assuming the message might be included in the response
});

// Type aliases for TypeScript
type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;

export type {SignInRequest,SignInResponse}


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
  // Optionally, validate the response format here if needed
  const responseValidation = SignInResponseSchema.safeParse(responseData);
  if (!responseValidation.success) {
    throw new Error("Invalid response data");
  }

  return responseValidation.data;
};
