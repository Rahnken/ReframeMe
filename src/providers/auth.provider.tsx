import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../api/auth";

type TAuthState = "loading"|"authenticated"|"unauthenticated";

type TAuthContext = {
    authState:TAuthState;
    user:User|null;
    token:string|null;
    setUser: (user:User) => void
};

export const AuthContext = createContext({} as TAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {


  const [user, setUser] = useState<null| User>(null);
  const [isLoading,setIsLoading] = useState(true);
  const token = user?.token

  const calcAuthState = () => {
      if(isLoading) return "loading"
      return user ? "authenticated": "unauthenticated"
    } 
    const authState:TAuthState = calcAuthState()
  useEffect(()=>{
   
    if(!token) {
        setUser(null)
        setIsLoading(false)
    }
  },[])
  return (
    <AuthContext.Provider
      value={{
       authState,
       user,
       setUser,
       token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};