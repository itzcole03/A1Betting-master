import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingOverlay = ({ message = 'Loading...', subMessage, show = true }) => {
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in", children: _jsxs("div", { className: "glass-morphism rounded-3xl p-8 flex flex-col items-center space-y-4 animate-scale-in min-w-[300px]", children: [_jsxs("svg", { className: "animate-spin h-10 w-10 text-primary-500 mb-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })] }), _jsx("div", { className: "text-xl font-bold text-white text-center drop-shadow-lg", children: message }), subMessage && _jsx("div", { className: "text-base text-gray-200 text-center", children: subMessage })] }) }));
};
export default LoadingOverlay;
