import { jsx as _jsx } from "react/jsx-runtime";
function LoadingSpinner({ className = '' }) {
    return (_jsx("div", { className: `flex justify-center items-center py-4 ${className}`, children: _jsx("div", { className: "w-6 h-6 border-2 border-primary rounded-full animate-spin border-t-transparent" }) }));
}
export default LoadingSpinner;
