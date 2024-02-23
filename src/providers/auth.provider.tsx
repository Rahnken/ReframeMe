/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from "react";
import { User } from "../api/users/auth";


export interface AuthContext {
    isAuthenticated:boolean;
    user:User|null;
    token?:string;
    setUser: (user:User | null) => void
}

export const AuthContext = createContext<AuthContext|null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null| User>(null);
  const token = user?.token
  const isAuthenticated = !!user
  return (
    <AuthContext.Provider
      value={{
       isAuthenticated,
       user,
       setUser,
       token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext)

  if(!context) {
    throw new Error("useAuth must be used with an AuthProvider")
  }
  return context
}