export type SigninRequest = {
  username: string;
  password: string;
};

export type TUserSignedIn = {
  token?: string;
  userInfo?: {
    email: string;
    username: string;
    lastLogin: string;
  };
  message?: string;
};
