import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LoadingScreen() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Loading..." }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Please wait while we set things up" })] }) }));
}
