import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router";
import theme from "./theme.ts";
import { AuthProvider } from "./context/AuthContext.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
