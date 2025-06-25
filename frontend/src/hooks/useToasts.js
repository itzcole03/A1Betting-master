import { useState, useCallback } from "react";
export function useToasts() {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = "info", duration = 5000) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newToast = {
            id,
            message,
            type,
            duration,
            timestamp: new Date(),
        };
        setToasts((prev) => [...prev, newToast]);
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id;
    }, []);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);
    const updateToast = useCallback((id, updates) => {
        setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast)));
    }, []);
    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        updateToast,
    };
}
