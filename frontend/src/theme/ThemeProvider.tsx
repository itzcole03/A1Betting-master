import React, { createContext, useContext, useState, useEffect } from "react";

// ============================================================================
// THEME TYPES
// ============================================================================

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  animations: {
    fast: string;
    normal: string;
    slow: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

const lightTheme: Theme = {
  name: "light",
  colors: {
    primary: "#2563eb",
    secondary: "#7c3aed",
    accent: "#06b6d4",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1f2937",
    muted: "#6b7280",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#0284c7",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
    "3xl": "6rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  animations: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.6s ease",
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  name: "dark",
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    muted: "#94a3b8",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#0ea5e9",
  },
};

// ============================================================================
// THEME CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [isDark, setIsDark] = useState(defaultTheme === "dark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("a1betting-theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("a1betting-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("a1betting-theme", "light");
    }

    // Apply CSS custom properties for theme colors
    const theme = isDark ? darkTheme : lightTheme;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
    });
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const setTheme = (theme: "light" | "dark") => {
    setIsDark(theme === "dark");
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkTheme.colors : lightTheme.colors;
};

export const getThemeValue = (
  path: string,
  isDark: boolean = false,
): string => {
  const theme = isDark ? darkTheme : lightTheme;
  const keys = path.split(".");
  let value: any = theme;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || "";
};

// CSS class utilities for common theme patterns
export const themeClasses = {
  // Glass effect cards
  glassCard:
    "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30",

  // Gradient backgrounds
  gradientPrimary: "bg-gradient-to-br from-blue-500 to-purple-600",
  gradientSecondary: "bg-gradient-to-br from-purple-500 to-pink-600",
  gradientAccent: "bg-gradient-to-br from-cyan-500 to-blue-600",

  // Text variants
  textPrimary: "text-gray-900 dark:text-white",
  textSecondary: "text-gray-600 dark:text-gray-300",
  textMuted: "text-gray-500 dark:text-gray-400",

  // Interactive elements
  buttonPrimary:
    "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200",
  buttonSecondary:
    "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200",

  // Surfaces
  surfacePrimary: "bg-white dark:bg-gray-800",
  surfaceSecondary: "bg-gray-50 dark:bg-gray-900",

  // Borders
  borderPrimary: "border-gray-200 dark:border-gray-700",
  borderSecondary: "border-gray-300 dark:border-gray-600",

  // Shadows
  shadowSm: "shadow-sm",
  shadowMd: "shadow-md",
  shadowLg: "shadow-lg",
  shadowXl: "shadow-xl",

  // Animations
  transitionAll: "transition-all duration-300 ease-in-out",
  transitionColors: "transition-colors duration-200 ease-in-out",

  // Focus states
  focusRing:
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
};

export default ThemeProvider;
