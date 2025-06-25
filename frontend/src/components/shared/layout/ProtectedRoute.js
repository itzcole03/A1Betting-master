import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { authService } from '@/services/auth';
export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { user } = useStore();
    if (!authService.isAuthenticated() || !user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
