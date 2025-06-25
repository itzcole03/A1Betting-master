interface SHAPValue {
    feature: string;
    value: number;
}
interface SHAPChartProps {
    shapValues: SHAPValue[];
    className?: string;
}
export declare function SHAPChart({ shapValues, className }: SHAPChartProps): import("react/jsx-runtime").JSX.Element;
export {};
