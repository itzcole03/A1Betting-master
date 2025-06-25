import { create } from 'zustand';
const initialMetrics = {
    updateCount: 0,
    lastUpdate: null,
    averageUpdateDuration: 0,
    totalUpdateDuration: 0,
    minUpdateDuration: null,
    maxUpdateDuration: null,
};
export const usePerformanceMetrics = create(() => ({
    ...initialMetrics,
}));
export function updatePerformanceMetrics(duration) {
    usePerformanceMetrics.setState(state => {
        const updateCount = state.updateCount + 1;
        const totalUpdateDuration = state.totalUpdateDuration + duration;
        const averageUpdateDuration = totalUpdateDuration / updateCount;
        const minUpdateDuration = state.minUpdateDuration === null ? duration : Math.min(state.minUpdateDuration, duration);
        const maxUpdateDuration = state.maxUpdateDuration === null ? duration : Math.max(state.maxUpdateDuration, duration);
        return {
            updateCount,
            lastUpdate: Date.now(),
            averageUpdateDuration,
            totalUpdateDuration,
            minUpdateDuration,
            maxUpdateDuration,
        };
    });
}
