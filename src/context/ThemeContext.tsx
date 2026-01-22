import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

type ThemeMode = "light" | "dark";
type FontSize = number;
type FontFamily = "Sarabun" | "Inter" | "Kanit";

interface ThemeSettings {
  mode: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
}

interface ThemeContextType extends ThemeSettings {
  toggleMode: () => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (font: FontFamily) => void;
}

const defaultSettings: ThemeSettings = {
  mode: "light",
  fontSize: 16,
  fontFamily: "Inter",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


const fontFamilyMap: Record<FontFamily, string> = {
  Sarabun: "'Sarabun', sans-serif",
  Inter: "'Inter', sans-serif",
  Kanit: "'Kanit', sans-serif",
};

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem("themeSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify(settings));
  }, [settings]);

  const toggleMode = () => {
    setSettings((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setFontFamily = (fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.mode,
          primary: {
            main: "#6366f1",
            light: "#818cf8",
            dark: "#4f46e5",
          },
          secondary: {
            main: "#ec4899",
          },
          background: {
            default: settings.mode === "light" ? "#f8fafc" : "#0f172a",
            paper: settings.mode === "light" ? "#ffffff" : "#1e293b",
          },
        },
        typography: {
          fontFamily: fontFamilyMap[settings.fontFamily],
          fontSize: settings.fontSize,
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  settings.mode === "light"
                    ? "0 1px 3px 0 rgb(0 0 0 / 0.1)"
                    : "0 1px 3px 0 rgb(0 0 0 / 0.3)",
              },
            },
          },
        },
      }),
    [settings],
  );

  return (
    <ThemeContext.Provider
      value={{
        ...settings,
        toggleMode,
        setFontSize,
        setFontFamily,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }
  return context;
};
