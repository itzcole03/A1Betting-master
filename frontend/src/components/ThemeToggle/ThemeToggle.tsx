import React from "react";
import { useTheme } from "../../providers/UniversalThemeProvider";

// Icons (using SVG for better control and consistency)
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CyberIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

interface ThemeToggleProps {
  variant?: "button" | "switch" | "icon";
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "button",
  showLabel = true,
  className = "",
  size = "md",
}) => {
  const { isDark, toggleDarkMode, variant: themeVariant, theme } = useTheme();

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const getIcon = () => {
    if (themeVariant.startsWith("cyber")) {
      return isDark ? <SunIcon /> : <MoonIcon />;
    }
    return isDark ? <SunIcon /> : <MoonIcon />;
  };

  const getLabel = () => {
    if (themeVariant.startsWith("cyber")) {
      return isDark ? "Light Mode" : "Dark Mode";
    }
    return isDark ? "Light Mode" : "Dark Mode";
  };

  const getButtonStyle = () => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "500",
    };

    if (themeVariant.startsWith("cyber")) {
      return {
        ...baseStyle,
        background: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)"}`,
        color: isDark ? "#ffffff" : "#0f172a",
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.1)"
          : "0 8px 32px rgba(15, 23, 42, 0.1)",
      };
    }

    return {
      ...baseStyle,
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      color: theme.colors.text.primary,
      boxShadow: theme.effects.shadow,
    };
  };

  const handleToggle = () => {
    toggleDarkMode();
  };

  if (variant === "switch") {
    return (
      <label className={`cyber-theme-switch ${className}`}>
        <input
          type="checkbox"
          checked={!isDark}
          onChange={handleToggle}
          style={{ display: "none" }}
        />
        <div
          style={{
            position: "relative",
            width: "60px",
            height: "30px",
            borderRadius: "15px",
            background: isDark
              ? "linear-gradient(135deg, #1e293b, #334155)"
              : "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
            border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)"}`,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: isDark ? "3px" : "calc(100% - 27px)",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #06ffa5, #00ff88)",
              boxShadow: "0 2px 8px rgba(6, 255, 165, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              color: "#000",
            }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
        {showLabel && (
          <span
            style={{
              marginLeft: "12px",
              color: theme.colors.text.secondary,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {getLabel()}
          </span>
        )}
      </label>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        className={`cyber-theme-toggle-icon ${className}`}
        style={{
          ...getButtonStyle(),
          width: "40px",
          height: "40px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`cyber-theme-toggle ${className} ${sizeClasses[size]}`}
      style={getButtonStyle()}
    >
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </button>
  );
};

// Enhanced theme toggle with mode indicator
export const CyberThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const { variant: themeVariant, isDark } = useTheme();

  return (
    <div
      className="cyber-theme-toggle-container"
      style={{ position: "relative" }}
    >
      <ThemeToggle {...props} />
      {themeVariant.startsWith("cyber") && (
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #06ffa5, #00ff88)",
            border: `2px solid ${isDark ? "#0f172a" : "#ffffff"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            animation: "cyber-pulse 2s ease-in-out infinite",
          }}
        >
          <CyberIcon />
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
