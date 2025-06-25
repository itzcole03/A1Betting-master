import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/useAuth';
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        // Redirect to login page with return url
        return _jsx(Navigate, { replace: true, state: { from: location }, to: "/login" });
    }
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to unauthorized page
        return _jsx(Navigate, { replace: true, to: "/unauthorized" });
    }
    return _jsx(_Fragment, { children: children });
};
export default React.memo(ProtectedRoute);
