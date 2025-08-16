
import { z } from 'zod';
import { ThemeTypeSchema } from '../../providers/theme.provider';

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
  token: z.string().optional(),
  userInfo: z.object({
    email: z.string(), 
    username: z.string(),
    lastLogin: z.string().datetime().nullable(),
    theme:  ThemeTypeSchema,
  }).optional(),
  message: z.string().optional(), // Assuming the message might be included in the response
});

// Type aliases for TypeScript
type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof SignInResponseSchema>

export type {SignInRequest,SignInResponse,UserCreateRequest,User}


const BASE_URL = import.meta.env.VITE_API_BASE_URL+"/user"
export const signInUser = async (
  body: SignInRequest
): Promise<SignInResponse> => {
  // Validate request body against SignInRequestSchema
  const requestBody = SignInRequestSchema.safeParse(body);
  if (!requestBody.success) {
    throw new Error("Invalid request data");
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(requestBody.data), // Use validated data
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  // Optionally, validate the response format here if needed
  const responseValidation = SignInResponseSchema.safeParse(responseData);
  
  if (!responseValidation.success) {
    throw new Error(responseValidation.error.message);
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

// Email update
const updateEmailRequestSchema = z.object({
  newEmail: z.string().email(),
  currentPassword: z.string(),
});

type UpdateEmailRequest = z.infer<typeof updateEmailRequestSchema>;

export const updateUserEmail = async (
  token: string,
  body: UpdateEmailRequest
): Promise<unknown> => {
  const result = updateEmailRequestSchema.safeParse(body);
  if (!result.success) throw new Error("Invalid request data");

  const response = await fetch(`${BASE_URL}/email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update email");
  }

  return await response.json();
};

// Username update
const updateUsernameRequestSchema = z.object({
  newUsername: z.string().min(1),
  currentPassword: z.string(),
});

type UpdateUsernameRequest = z.infer<typeof updateUsernameRequestSchema>;

export const updateUserUsername = async (
  token: string,
  body: UpdateUsernameRequest
): Promise<unknown> => {
  const result = updateUsernameRequestSchema.safeParse(body);
  if (!result.success) throw new Error("Invalid request data");

  const response = await fetch(`${BASE_URL}/username`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update username");
  }

  return await response.json();
};

// Password update
const updatePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;

export const updateUserPassword = async (
  token: string,
  body: UpdatePasswordRequest
): Promise<unknown> => {
  const result = updatePasswordRequestSchema.safeParse(body);
  if (!result.success) throw new Error("Invalid request data");

  const response = await fetch(`${BASE_URL}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update password");
  }

  return await response.json();
};

export type { UpdateEmailRequest, UpdateUsernameRequest, UpdatePasswordRequest };
