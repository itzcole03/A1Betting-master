import React from "react";
interface MetricCardProps {
    label: string;
    value: string | number;
    icon: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
    className?: string;
    glowing?: boolean;
}
declare const MetricCard: React.FC<MetricCardProps>;
export default MetricCard;
