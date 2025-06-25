import React from "react";
import { cn } from "../../lib/utils";

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const HolographicText: React.FC<HolographicTextProps> = ({
  children,
  className = "",
  animated = true,
  size = "xl",
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  const animatedClass = animated ? "animate-cyber-pulse" : "";

  return (
    <span
      className={cn(
        "holographic font-black tracking-tight cyber-title",
        sizes[size],
        animatedClass,
        className,
      )}
    >
      {children}
    </span>
  );
};

export default HolographicText;
