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

library.add(fas, faTwitter, faFontAwesome);

const router = createRouter({ routeTree,defaultPreload:'intent',context:{auth:undefined!} });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{auth}}/>
}


function App() {
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp/>
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
