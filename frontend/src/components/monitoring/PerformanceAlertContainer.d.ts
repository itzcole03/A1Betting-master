import React from 'react';
import { PerformanceAlert as AlertType } from './PerformanceAlert';
interface PerformanceAlertContainerProps {
    alerts: AlertType[];
    onDismiss?: (id: string) => void;
    onAcknowledge?: (id: string) => void;
    maxAlerts?: number;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
}
declare const _default: React.NamedExoticComponent<PerformanceAlertContainerProps>;
export default _default;
