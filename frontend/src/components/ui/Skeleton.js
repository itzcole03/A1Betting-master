import { jsx as _jsx } from "react/jsx-runtime";
export const Skeleton = ({ className = '', width, height, rounded = 'rounded-xl' }) => (_jsx("div", { className: `bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${rounded} ${className}`, style: { width, height }, "aria-busy": "true", "aria-live": "polite" }));
export default Skeleton;
