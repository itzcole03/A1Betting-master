import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/hooks/useTheme';
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (_jsxs("button", { className: "rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300", type: "button", onClick: toggleTheme, children: [_jsx("span", { className: "sr-only", children: "Toggle theme" }), theme === 'dark' ? (_jsx(SunIcon, { "aria-hidden": "true", className: "h-6 w-6" })) : (_jsx(MoonIcon, { "aria-hidden": "true", className: "h-6 w-6" }))] }));
}
