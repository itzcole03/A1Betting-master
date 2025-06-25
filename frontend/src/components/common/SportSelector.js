import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SPORT_OPTIONS } from "../../constants/sports";
export function SportSelector({ selectedSport, onSportChange, label }) {
    return (_jsxs("div", { children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: label })), _jsx("select", { value: selectedSport, onChange: (e) => onSportChange(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white", title: label || "Sport", children: SPORT_OPTIONS.map((sport) => (_jsx("option", { value: sport, children: sport }, sport))) })] }));
}
