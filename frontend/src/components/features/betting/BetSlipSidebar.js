import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
const BetSlipSidebar = () => {
    const { legs, removeLeg, clearSlip, updateStake, stake, potentialPayout, isSubmitting, submitSlip, addToast, } = useAppStore(state => ({
        legs: state.legs,
        removeLeg: state.removeLeg,
        clearSlip: state.clearSlip,
        updateStake: state.updateStake,
        stake: state.stake,
        potentialPayout: state.potentialPayout,
        isSubmitting: state.isSubmitting,
        submitSlip: state.submitSlip,
        addToast: state.addToast,
    }));
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const handleSubmit = async () => {
        if (legs.length < 2) {
            addToast({ message: 'Select at least 2 picks to submit a bet.', type: 'warning' });
            return;
        }
        if (stake <= 0) {
            addToast({ message: 'Please enter a valid stake amount.', type: 'warning' });
            return;
        }
        const result = await submitSlip();
        if (result) {
            setIsMobileOpen(false);
        }
    };
    // Mobile toggle button
    const MobileToggle = () => (_jsx("button", { className: "fixed bottom-6 right-6 z-[101] p-4 rounded-full bg-gradient-to-br from-primary-700 to-primary-500 text-white shadow-2xl lg:hidden animate-bounce-subtle", onClick: () => setIsMobileOpen(true), "aria-label": "Open Bet Slip", children: "\uD83E\uDDFE" }));
    // Main betslip content
    const BetSlipContent = (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-white drop-shadow-lg", children: "Bet Slip" }), _jsx("button", { className: "p-2 rounded-full text-white hover:bg-primary/20 transition-colors", onClick: () => (setIsMobileOpen(false)), "aria-label": "Close bet slip", children: _jsx(X, { size: 26 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-3", children: legs.length === 0 ? (_jsxs("div", { className: "text-center text-primary-100 py-12", children: [_jsx("span", { className: "text-4xl", children: "\uD83E\uDDFE" }), _jsx("div", { className: "mt-2 text-lg font-semibold", children: "No picks yet" }), _jsx("div", { className: "text-primary-200", children: "Add player props to build your bet slip." })] })) : (legs.map((leg, idx) => (_jsxs("div", { className: "glass rounded-xl p-4 flex items-center justify-between bg-gradient-to-r from-primary-700/30 to-primary-500/20", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-white", children: leg.playerName }), _jsxs("div", { className: "text-primary-200 text-sm", children: [leg.statType, " ", leg.pick.toUpperCase(), " ", leg.line] })] }), _jsx("button", { className: "ml-4 p-2 rounded-full hover:bg-red-500/20 text-red-300", onClick: () => removeLeg(leg.propId, leg.pick), "aria-label": "Remove pick", children: _jsx(X, { size: 20 }) })] }, idx)))) }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-primary-100 font-semibold", children: "Entry Amount" }), _jsx("input", { type: "number", min: 1, max: 10000, value: stake, onChange: e => updateStake(Number(e.target.value)), className: "premium-input-container w-32 text-right text-lg font-bold text-primary-700 dark:text-primary-200" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-primary-100 font-semibold", children: "Potential Payout" }), _jsxs("span", { className: "text-yellow-300 text-xl font-extrabold", children: ["$", potentialPayout.toFixed(2)] })] }), _jsx("button", { className: "w-full modern-button px-8 py-4 rounded-2xl text-lg font-bold bg-green-500 hover:bg-green-600 disabled:opacity-50", onClick: handleSubmit, disabled: legs.length < 2 || stake <= 0 || isSubmitting, children: isSubmitting ? 'Submitting...' : legs.length < 2 ? 'Select 2+ Picks' : 'Submit Entry' }), legs.length > 0 && (_jsx("button", { className: "w-full mt-2 text-sm underline text-primary-200 hover:text-white", onClick: clearSlip, children: "Clear All" }))] })] }));
    // Desktop sidebar
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden lg:flex flex-col fixed top-0 right-0 h-full w-[380px] z-[100] p-6 bg-gradient-to-br from-primary-900/90 to-primary-700/80 glass shadow-2xl animate-fade-in", children: BetSlipContent }), _jsx(MobileToggle, {}), isMobileOpen && (_jsx("div", { className: "fixed inset-0 z-[101] flex items-end justify-center bg-black/60 backdrop-blur-xl animate-fade-in lg:hidden", children: _jsx("div", { className: "w-full max-w-md bg-gradient-to-br from-primary-900/90 to-primary-700/80 glass rounded-t-3xl shadow-2xl p-6", children: BetSlipContent }) }))] }));
};
export default BetSlipSidebar;
