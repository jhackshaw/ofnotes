import React, {
  useMemo,
  createContext,
  useState,
  useCallback,
  useContext,
} from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

type PaletteType = "light" | "dark";
export interface ThemeContextType {
  paletteType: PaletteType;
  togglePalette(): void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

let palettePreference = localStorage.getItem("paletteType") as PaletteType;
/* istanbul ignore next */
if (!palettePreference || !["light", "dark"].includes(palettePreference)) {
  palettePreference = "dark";
}

export const ProvideThemeContext: React.FC = ({ children }) => {
  const [paletteType, setPaletteType] = useState<PaletteType>(
    palettePreference
  );

  const togglePalette = useCallback(() => {
    setPaletteType((prevType) => {
      const newType = prevType === "dark" ? "light" : "dark";
      localStorage.setItem("paletteType", newType);
      return newType;
    });
  }, [setPaletteType]);

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: paletteType,
        },
      }),
    [paletteType]
  );

  const ctx: ThemeContextType = {
    paletteType,
    togglePalette,
  };

  return (
    <ThemeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("Theme Context must be used within ProvideThemeContext");
  }
  return ctx;
};
