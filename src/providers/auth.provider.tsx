/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SignInResponseSchema, User } from "../api/users/auth";
import { useNavigate } from "@tanstack/react-router";

type AuthState = "authenticated" | "unauthenticated" | "loading";

export type AuthContextType = {
  authState: AuthState;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const deriveAuthState = ({
  user,
  isLoading,
}: {
  user: User | null;
  isLoading: boolean;
}): AuthState => {
  if (isLoading) return "loading";
  if (user) return "authenticated";
  else return "unauthenticated";
};

const clearUser = () => {
  localStorage.removeItem("user");
};

const getUserFromLocalStorage = (): User | null => {
  const userFromLocalStorage = localStorage.getItem("user");
  try {
    return SignInResponseSchema.parse(JSON.parse(userFromLocalStorage || ""));
  } catch (e) {
    clearUser();
    return null;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const authState = deriveAuthState({ user, isLoading });
  const resetThemeDefault = () => {
    localStorage.setItem("theme", "reframeDark");
    document.documentElement.setAttribute("data-theme", "reframeDark");
  };
  const logout = () => {
    console.log("Logging out");
    clearUser();
    resetThemeDefault();
    setUser(null);
    navigate({ to: "/" });
  };

  const login = (data: User) => {
    setIsLoading(false);
    setUser(data);
  };

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!user) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    login(user);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        authState,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with an AuthProvider");
  }
  return context;
}
