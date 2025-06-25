interface FeatureImpact {
    feature: string;
    value: number;
    impact: number;
    direction: 'positive' | 'negative';
}
interface SHAPVisualizationProps {
    explanations: FeatureImpact[];
}
declare const SHAPVisualization: ({ explanations }: SHAPVisualizationProps) => import("react/jsx-runtime").JSX.Element;
export default SHAPVisualization;
