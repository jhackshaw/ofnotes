import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@material-ui/core";

export interface SideBarContextType {
  expanded: boolean;
  toggleExpanded(): void;
  setExpanded(expaned: boolean): void;
}

export const SideBarContext = createContext<SideBarContextType | undefined>(
  undefined
);

export const ProvidSideBarContext: React.FC = ({ children }) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const defaultExpanded =
      isLarge &&
      !(
        location.pathname.endsWith("create") ||
        location.pathname.endsWith("edit")
      );
    setExpanded(defaultExpanded);
  }, [isLarge, location.pathname]);

  const toggleExpanded = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, [setExpanded]);

  const ctx: SideBarContextType = {
    expanded,
    toggleExpanded,
    setExpanded,
  };

  return (
    <SideBarContext.Provider value={ctx}>{children}</SideBarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const ctx = useContext(SideBarContext);
  if (ctx === undefined) {
    throw new Error(
      "Sidebar Context must be used within ProvideSidebarContext"
    );
  }
  return ctx;
};
