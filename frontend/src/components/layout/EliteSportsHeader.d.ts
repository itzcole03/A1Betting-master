import React from "react";
interface EliteSportsHeaderProps {
    connectedSources: number;
    dataQuality: number;
    state?: {
        darkMode?: boolean;
    };
    toggleDarkMode: () => void;
    refreshData: () => Promise<void>;
    loading: boolean;
}
export declare const EliteSportsHeader: React.FC<EliteSportsHeaderProps>;
export {};
