import { SigninRequest, TUserSignedIn } from "../types";

const BASE_URL = "http://localhost:4000/user";

export const signInUser = async (
  body: SigninRequest
): Promise<TUserSignedIn> => {
  // Call backend

  const response: TUserSignedIn = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "CONTENT-TYPE": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);

  return response;
};
