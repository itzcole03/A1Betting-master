import React from 'react';
import { Alert } from '../hooks/useSmartAlerts';
interface SmartAlertsProps {
    wsEndpoint: string;
    onAlertClick?: (alert: Alert) => void;
}
export declare const SmartAlerts: React.FC<SmartAlertsProps>;
export {};
