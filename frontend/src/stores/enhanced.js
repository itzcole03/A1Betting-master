import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { updatePerformanceMetrics } from './monitoring';
const initialState = {
    data: {
        id: uuidv4(),
        name: '',
        email: '',
        preferences: {
            theme: 'light',
            notifications: true,
        },
    },
    validation: {
        isValid: true,
        errors: [],
    },
    metrics: {
        updateCount: 0,
        errorCount: 0,
        lastUpdate: null,
    },
};
export const useUserStore = create()(persist(devtools(immer(set => ({
    ...initialState,
    setState: updater => {
        set(state => {
            const start = performance.now();
            const { setState, ...userState } = state;
            const newState = updater(userState);
            const end = performance.now();
            updatePerformanceMetrics(end - start);
            // Validate state
            const errors = [];
            if (!newState.data.name) {
                errors.push('Name is required');
            }
            if (!newState.data.email) {
                errors.push('Email is required');
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newState.data.email)) {
                errors.push('Invalid email format');
            }
            // Update validation and metrics
            newState.validation.isValid = errors.length === 0;
            newState.validation.errors = errors;
            newState.metrics.updateCount += 1;
            newState.metrics.errorCount += errors.length;
            newState.metrics.lastUpdate = new Date().toISOString();
            return { ...newState, setState };
        });
    },
})), { name: 'UserStore' }), {
    name: 'user-store',
    version: 1,
    partialize: (state) => ({
        data: state.data,
        version: '1.0.0',
    }),
}));
