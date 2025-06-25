import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';
export const QuickBetButton = ({ amount, odds, isActive = false, isQuickBetEnabled = true, onQuickBet, className, ...props }) => {
    const potentialReturn = amount * odds;
    const buttonStyles = twMerge('relative overflow-hidden transition-all duration-200', isActive ? 'ring-2 ring-primary-500' : '', isQuickBetEnabled ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed', className);
    const handleClick = () => {
        if (isQuickBetEnabled && onQuickBet) {
            onQuickBet(amount);
        }
    };
    return (_jsx(Button, { className: buttonStyles, disabled: !isQuickBetEnabled, size: "sm", variant: "primary", onClick: handleClick, ...props, children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsxs("span", { className: "font-medium", children: ["$", amount] }), _jsxs("span", { className: "text-xs opacity-90", children: ["Return: $", potentialReturn.toFixed(2)] })] }) }));
};
