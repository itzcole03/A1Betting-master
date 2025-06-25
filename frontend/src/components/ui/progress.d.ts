import * as React from "react";
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    color?: string;
    className?: string;
}
export declare const Progress: React.FC<ProgressProps>;
