import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./configs/i18n";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
