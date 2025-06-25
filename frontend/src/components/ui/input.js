import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
export const Input = React.forwardRef(({ className = "", ...props }, ref) => (_jsx("input", { ref: ref, className: `block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`, ...props })));
Input.displayName = "Input";
