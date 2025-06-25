import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext();
export function useToast() {
    return useContext(ToastContext);
}
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((msg, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(toast => toast.id !== id)), duration);
    }, []);
    return (_jsxs(ToastContext.Provider, { value: addToast, children: [children, _jsx("div", { className: "fixed bottom-4 right-4 z-50 space-y-2", children: toasts.map(toast => (_jsx("div", { className: `px-4 py-2 rounded shadow text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}`, children: toast.msg }, toast.id))) })] }));
}
