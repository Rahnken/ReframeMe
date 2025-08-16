/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SignInResponseSchema, User } from "../api/users/auth";

type AuthState = "authenticated" | "unauthenticated" | "loading";

export type AuthContextType = {
  authState: AuthState;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  handleAuthError: (error: any) => void;
};

const deriveAuthState = ({
  user,
  isLoading,
}: {
  user: User | null;
  isLoading: boolean;
}): AuthState => {
  if (isLoading) return "loading";
  if (user) {
    return "authenticated";
  } else return "unauthenticated";
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

  const authState = deriveAuthState({ user, isLoading });
  const resetThemeDefault = () => {
    localStorage.setItem("theme", "reframeDark");
    document.documentElement.setAttribute("data-theme", "reframeDark");
  };
  
  const logout = async () => {
    setIsLoading(true);
    clearUser();
    resetThemeDefault();
    setUser(null);
    setIsLoading(false);
    // Navigate to home page
    window.location.href = '/';
  };

  const handleAuthError = (error: any) => {
    // Check if it's a 401 Unauthorized or user not found error
    if (error?.status === 401 || 
        error?.message?.includes('user not found') ||
        error?.message?.includes('User not found') ||
        error?.message?.includes('unauthorized')) {
      console.log('Auth error detected, logging out:', error);
      logout();
    }
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
        handleAuthError,
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
