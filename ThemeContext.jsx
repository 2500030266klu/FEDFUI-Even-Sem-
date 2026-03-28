// src/context/ThemeContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}