import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component using default import syntax
import { useNotificationPopups } from "../hooks/useNotificationPopups";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    // Wait for auth state to be determined (not loading)
    while (context.auth.authState === "loading") {
      // Wait a small amount of time for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    if (context.auth.authState !== "authenticated") {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },

  pendingComponent: () => <LoadingScreen />,

  component: () => {
    const AuthLayout = () => {
      const { auth } = Route.useRouteContext();
      const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
      
      useEffect(() => {
        const handleVisibilityChange = () => {
          setIsTabVisible(!document.hidden);
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
      }, []);
      
      // Enable notification popups for authenticated users
      // Poll more frequently when tab is visible, less when hidden
      useNotificationPopups({
        token: auth.user?.token || '',
        enabled: !!auth.user?.token,
        pollInterval: isTabVisible ? 30000 : 120000, // 30s visible, 2min hidden
        showPopups: isTabVisible, // Only show popups when tab is visible
      });

      return <Outlet />;
    };

    return <AuthLayout />;
  },
});
