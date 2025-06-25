import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ThemeVariant = "cyber-light" | "cyber-dark";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeConfig {
  variant: ThemeVariant;
  colors: ThemeColors;
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  effects: {
    glass: string;
    blur: string;
    shadow: string;
    glow: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

interface ThemeContextType {
  theme: ThemeConfig;
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

// ============================================================================
// SAFE THEME DEFINITIONS
// ============================================================================

const CYBER_LIGHT_THEME: ThemeConfig = {
  variant: "cyber-light",
  colors: {
    primary: "#06ffa5",
    secondary: "#00ff88",
    accent: "#00d4ff",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)",
    surface: "rgba(255, 255, 255, 0.8)",
    text: {
      primary: "#0f172a",
      secondary: "#334155",
      muted: "#64748b",
    },
    border: "rgba(15, 23, 42, 0.1)",
    success: "#06ffa5",
    warning: "#fbbf24",
    error: "#ff4757",
  },
  gradients: {
    primary: "linear-gradient(135deg, #06ffa5, #00ff88)",
    secondary: "linear-gradient(135deg, #00d4ff, #7c3aed)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)",
  },
  effects: {
    glass:
      "backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(15, 23, 42, 0.1);",
    blur: "backdrop-filter: blur(8px);",
    shadow: "0 8px 32px rgba(15, 23, 42, 0.1), 0 0 20px rgba(6, 255, 165, 0.1)",
    glow: "0 0 20px rgba(6, 255, 165, 0.6), 0 0 40px rgba(6, 255, 165, 0.4)",
  },
  animations: {
    duration: "300ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

const CYBER_DARK_THEME: ThemeConfig = {
  variant: "cyber-dark",
  colors: {
    primary: "#06ffa5",
    secondary: "#00ff88",
    accent: "#00d4ff",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)",
    surface: "rgba(255, 255, 255, 0.05)",
    text: {
      primary: "#ffffff",
      secondary: "#e2e8f0",
      muted: "#94a3b8",
    },
    border: "rgba(255, 255, 255, 0.1)",
    success: "#06ffa5",
    warning: "#fbbf24",
    error: "#ff4757",
  },
  gradients: {
    primary: "linear-gradient(135deg, #06ffa5, #00ff88)",
    secondary: "linear-gradient(135deg, #00d4ff, #7c3aed)",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)",
  },
  effects: {
    glass:
      "backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);",
    blur: "backdrop-filter: blur(8px);",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 255, 165, 0.2)",
    glow: "0 0 20px rgba(6, 255, 165, 0.6), 0 0 40px rgba(6, 255, 165, 0.4)",
  },
  animations: {
    duration: "300ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ============================================================================
// SAFE THEME FUNCTIONS
// ============================================================================

const getThemeConfig = (variant: ThemeVariant): ThemeConfig => {
  switch (variant) {
    case "cyber-dark":
      return CYBER_DARK_THEME;
    case "cyber-light":
    default:
      return CYBER_LIGHT_THEME;
  }
};

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface SafeThemeProviderProps {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
  enablePersistence?: boolean;
}

export const SafeThemeProvider: React.FC<SafeThemeProviderProps> = ({
  children,
  defaultVariant = "cyber-light",
  enablePersistence = true,
}) => {
  const [variant, setVariantState] = useState<ThemeVariant>(() => {
    if (enablePersistence && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("theme-variant");
        if (saved === "cyber-light" || saved === "cyber-dark") {
          return saved as ThemeVariant;
        }
      } catch (error) {
        console.warn("Failed to load theme from localStorage:", error);
      }
    }
    return defaultVariant;
  });

  const theme = getThemeConfig(variant);
  const isDark = variant === "cyber-dark";

  const setVariant = (newVariant: ThemeVariant) => {
    setVariantState(newVariant);
    if (enablePersistence && typeof window !== "undefined") {
      try {
        localStorage.setItem("theme-variant", newVariant);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  };

  const toggleDarkMode = () => {
    const newVariant = isDark ? "cyber-light" : "cyber-dark";
    setVariant(newVariant);
  };

  // Apply theme to document
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const root = document.documentElement;
      const body = document.body;

      // Set CSS custom properties
      root.style.setProperty("--color-primary", theme.colors.primary);
      root.style.setProperty("--color-secondary", theme.colors.secondary);
      root.style.setProperty("--color-accent", theme.colors.accent);
      root.style.setProperty("--color-background", theme.colors.background);
      root.style.setProperty("--color-surface", theme.colors.surface);
      root.style.setProperty("--color-text-primary", theme.colors.text.primary);
      root.style.setProperty(
        "--color-text-secondary",
        theme.colors.text.secondary,
      );
      root.style.setProperty("--color-text-muted", theme.colors.text.muted);
      root.style.setProperty("--color-border", theme.colors.border);
      root.style.setProperty("--color-success", theme.colors.success);
      root.style.setProperty("--color-warning", theme.colors.warning);
      root.style.setProperty("--color-error", theme.colors.error);

      // Set gradient variables
      root.style.setProperty("--gradient-primary", theme.gradients.primary);
      root.style.setProperty("--gradient-secondary", theme.gradients.secondary);
      root.style.setProperty(
        "--gradient-background",
        theme.gradients.background,
      );

      // Clear existing theme classes
      body.className = body.className.replace(/theme-[\w-]+/g, "");
      root.classList.remove("dark", "light", "cyber-light", "cyber-dark");

      // Add current theme classes
      body.classList.add(`theme-${variant}`);
      root.classList.add(variant);

      // Set dark/light mode classes
      if (isDark) {
        root.classList.add("dark");
        body.classList.add("dark");
      } else {
        root.classList.add("light");
        body.classList.add("light");
      }

      // Apply background and text color
      body.style.background = theme.colors.background;
      body.style.color = theme.colors.text.primary;
      body.style.fontFamily = '"Inter", system-ui, sans-serif';
      body.style.minHeight = "100vh";

      // Apply to root as well for consistency
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.style.background = theme.colors.background;
        rootElement.style.color = theme.colors.text.primary;
        rootElement.style.minHeight = "100vh";
      }
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }, [theme, variant, isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        variant,
        setVariant,
        isDark,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return safe fallback instead of throwing
    console.warn(
      "useTheme called outside of SafeThemeProvider, using fallback",
    );
    return {
      theme: CYBER_LIGHT_THEME,
      variant: "cyber-light",
      setVariant: () => {},
      isDark: false,
      toggleDarkMode: () => {},
    };
  }
  return context;
};

export default SafeThemeProvider;
