/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import { AuthProvider, useAuth } from "./providers/auth.provider";
import { ThemeProvider, useThemeProvider } from "./providers/theme.provider";

library.add(fas, faTwitter, faFontAwesome);
export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { auth: undefined!, theme: undefined!, queryClient },
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const theme = useThemeProvider();
  return <RouterProvider router={router} context={{ auth, theme }} />;
}

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <InnerApp />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
