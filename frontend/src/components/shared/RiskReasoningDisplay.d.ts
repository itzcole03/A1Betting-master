interface RiskReasoningDisplayProps {
    riskReasoning?: string[];
    className?: string;
}
/**
 * Displays risk reasoning as a list with icons and severity styling.
 * Omits display if riskReasoning is empty or undefined.
 */
export declare function RiskReasoningDisplay({ riskReasoning, className }: RiskReasoningDisplayProps): import("react/jsx-runtime").JSX.Element | null;
export {};
