import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { performanceService } from '../services/performanceService';
import { errorLogger } from '../utils/errorLogger';
export const PerformanceMonitor = ({ children }) => {
    useEffect(() => {
        const startMonitoring = async () => {
            try {
                // Initialize performance monitoring
                await performanceService.initialize();
                // Set up performance observers
                const observer = new PerformanceObserver(list => {
                    for (const entry of list.getEntries()) {
                        performanceService.trackMetric(entry);
                    }
                });
                // Observe various performance metrics
                observer.observe({
                    entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'],
                });
                // Track React component render times
                const originalRender = React.Component.prototype.render;
                React.Component.prototype.render = function () {
                    const start = performance.now();
                    const result = originalRender.apply(this);
                    const end = performance.now();
                    performanceService.trackComponentRender(this.constructor.name, end - start);
                    return result;
                };
                // Cleanup function
                return () => {
                    observer.disconnect();
                    React.Component.prototype.render = originalRender;
                };
            }
            catch (error) {
                errorLogger.logError(error, { context: 'PerformanceMonitor' });
            }
        };
        startMonitoring();
    }, []);
    return _jsx(_Fragment, { children: children });
};
