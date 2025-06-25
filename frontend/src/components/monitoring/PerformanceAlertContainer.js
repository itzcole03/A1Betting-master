import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PerformanceAlert from './PerformanceAlert';
const PerformanceAlertContainer = ({ alerts, onDismiss, onAcknowledge, maxAlerts = 5, autoDismiss = true, autoDismissDelay = 5000, }) => {
    const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
    const handleDismiss = (id) => {
        setDismissedAlerts(prev => new Set([...prev, id]));
        onDismiss?.(id);
    };
    const handleAcknowledge = (id) => {
        onAcknowledge?.(id);
    };
    const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id)).slice(0, maxAlerts);
    React.useEffect(() => {
        if (!autoDismiss)
            return;
        const timers = visibleAlerts.map(alert => {
            return setTimeout(() => {
                handleDismiss(alert.id);
            }, autoDismissDelay);
        });
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [visibleAlerts, autoDismiss, autoDismissDelay]);
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 space-y-4 w-96", children: _jsx(AnimatePresence, { children: visibleAlerts.map(alert => (_jsx(PerformanceAlert, { alert: alert, onAcknowledge: handleAcknowledge, onDismiss: handleDismiss }, alert.id))) }) }));
};
export default React.memo(PerformanceAlertContainer);
