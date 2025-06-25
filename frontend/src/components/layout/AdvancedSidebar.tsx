import React from "react";
import CyberSidebar from "./CyberSidebar";

// Legacy interface for backward compatibility
interface AdvancedSidebarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
  connectedSources?: number;
  dataQuality?: number;
  state?: { darkMode?: boolean };
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "fixed" | "drawer" | "floating";
  className?: string;
}

// Adapter component to maintain backward compatibility
export const AdvancedSidebar: React.FC<AdvancedSidebarProps> = ({
  currentSection,
  onSectionChange,
  isOpen,
  onClose,
  className,
  ...rest
}) => {
  return (
    <CyberSidebar
      currentPage={currentSection}
      onPageChange={onSectionChange}
      isOpen={isOpen}
      onClose={onClose}
      className={className}
    />
  );
};

export default AdvancedSidebar;
