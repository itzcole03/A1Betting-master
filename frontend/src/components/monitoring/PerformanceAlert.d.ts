import React from 'react';
export interface PerformanceAlert {
    id: string;
    metric: string;
    value: number;
    threshold: number;
    severity: 'critical' | 'warning' | 'info';
    timestamp: number;
    message: string;
}
interface PerformanceAlertProps {
    alert: PerformanceAlert;
    onDismiss?: (id: string) => void;
    onAcknowledge?: (id: string) => void;
}
declare const _default: React.NamedExoticComponent<PerformanceAlertProps>;
export default _default;
