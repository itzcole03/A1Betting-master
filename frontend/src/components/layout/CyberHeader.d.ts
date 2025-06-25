import React from "react";
interface CyberHeaderProps {
    currentPage?: string;
    onToggleSidebar?: () => void;
    theme?: "light" | "dark";
    onToggleTheme?: () => void;
    user?: {
        name: string;
        email: string;
        balance: number;
        tier: string;
        accuracy: number;
    };
    className?: string;
}
declare const CyberHeader: React.FC<CyberHeaderProps>;
export default CyberHeader;
