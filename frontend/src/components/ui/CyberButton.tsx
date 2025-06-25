import React from "react";

interface CyberButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  className = "",
  icon,
  size = "md",
  disabled = false,
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    position: "relative",
    overflow: "hidden",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      background: "linear-gradient(45deg, #00ff88, #00d4ff)",
      color: "#000",
      fontWeight: "700",
    },
    secondary: {
      background: "rgba(75, 85, 99, 0.8)",
      color: "#fff",
      border: "1px solid rgba(107, 114, 128, 0.6)",
    },
    ghost: {
      background: "transparent",
      color: "#06ffa5",
      border: "1px solid #06ffa5",
    },
  };

  const sizes = {
    sm: { padding: "8px 12px", fontSize: "14px" },
    md: { padding: "12px 24px", fontSize: "16px" },
    lg: { padding: "16px 32px", fontSize: "18px" },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "primary" && !disabled) {
      e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,136,0.6)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "primary" && !disabled) {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "translateY(0)";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
      }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <i className={`fas ${icon}`} style={{ fontSize: "16px" }} />}
      <span>{label}</span>
    </button>
  );
};

export default CyberButton;
