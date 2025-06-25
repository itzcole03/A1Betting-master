import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';
export const BettingButton = ({ betType = 'straight', odds, stake, potentialReturn, isPlacing = false, isConfirmed = false, showDetails = false, className, children, ...props }) => {
    const getVariant = () => {
        if (isConfirmed)
            return 'success';
        if (isPlacing)
            return 'primary';
        return 'primary';
    };
    const getButtonText = () => {
        if (isPlacing)
            return 'Placing Bet...';
        if (isConfirmed)
            return 'Bet Confirmed';
        return children || 'Place Bet';
    };
    const buttonStyles = twMerge('relative overflow-hidden', showDetails && 'min-h-[80px]', className);
    return (_jsxs(Button, { className: buttonStyles, disabled: isPlacing || isConfirmed, variant: getVariant(), ...props, children: [_jsxs("div", { className: "flex flex-col items-center justify-center w-full", children: [_jsx("span", { className: "font-medium", children: getButtonText() }), showDetails && (_jsxs("div", { className: "mt-1 text-sm opacity-90", children: [stake && _jsxs("span", { className: "mr-2", children: ["Stake: $", stake.toFixed(2)] }), odds && _jsxs("span", { className: "mr-2", children: ["Odds: ", odds.toFixed(2)] }), potentialReturn && _jsxs("span", { children: ["Return: $", potentialReturn.toFixed(2)] })] }))] }), isPlacing && (_jsx("div", { className: "absolute inset-0 bg-black/10 flex items-center justify-center", children: _jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }) }))] }));
};
