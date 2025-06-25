import React from 'react';
interface ModelStatus {
    id: string;
    name: string;
    status: 'active' | 'training' | 'error';
    confidence: number;
    lastUpdate: string;
}
interface MLStatusIndicatorsProps {
    models: ModelStatus[];
}
export declare const MLStatusIndicators: React.FC<MLStatusIndicatorsProps>;
export declare const ModelConfidenceIndicator: ({ confidence, size }: {
    confidence: number;
    size?: "sm" | "md" | "lg";
}) => import("react/jsx-runtime").JSX.Element;
export declare const ModelStatusBadge: ({ status }: {
    status: "active" | "training" | "error";
}) => import("react/jsx-runtime").JSX.Element;
export {};
