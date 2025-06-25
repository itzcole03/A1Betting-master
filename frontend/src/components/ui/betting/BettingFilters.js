import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState } from 'react';
import { useFilterStore } from '../../../stores/filterStore';
import { ConfidenceIndicator } from '../../../components/ConfidenceIndicator';
export const BettingFilters = memo(({ selectedSport, minConfidence, sortBy, onFilterChange }) => {
    // Preset management state/hooks
    const [presetName, setPresetName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const savePreset = useFilterStore(s => s.savePreset);
    const loadPreset = useFilterStore(s => s.loadPreset);
    const removePreset = useFilterStore(s => s.removePreset);
    const listPresets = useFilterStore(s => s.listPresets);
    const presets = listPresets();
    const handleSportChange = (sport) => {
        onFilterChange({ selectedSport: sport, minConfidence, sortBy });
    };
    const handleConfidenceChange = (confidence) => {
        onFilterChange({ selectedSport, minConfidence: confidence, sortBy });
    };
    const handleSortChange = (sort) => {
        onFilterChange({ selectedSport, minConfidence, sortBy: sort });
    };
    // Preset handlers
    const handleSavePreset = () => {
        if (presetName.trim()) {
            savePreset(presetName.trim());
            setPresetName('');
        }
    };
    const handleLoadPreset = (name) => {
        setSelectedPreset(name);
        loadPreset(name);
    };
    const handleRemovePreset = () => {
        if (selectedPreset) {
            removePreset(selectedPreset);
            setSelectedPreset('');
        }
    };
    return (_jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sport" }), _jsxs("select", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500", value: selectedSport, onChange: e => handleSportChange(e.target.value), children: [_jsx("option", { value: "all", children: "All Sports" }), _jsx("option", { value: "NBA", children: "NBA" }), _jsx("option", { value: "NFL", children: "NFL" }), _jsx("option", { value: "MLB", children: "MLB" }), _jsx("option", { value: "NHL", children: "NHL" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Min Confidence" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { className: "w-full", max: "0.95", min: "0.5", step: "0.05", type: "range", value: minConfidence, onChange: e => handleConfidenceChange(Number(e.target.value)) }), _jsx(ConfidenceIndicator, { confidence: minConfidence })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sort By" }), _jsxs("select", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500", value: sortBy, onChange: e => handleSortChange(e.target.value), children: [_jsx("option", { value: "confidence", children: "Confidence" }), _jsx("option", { value: "value", children: "Expected Value" }), _jsx("option", { value: "odds", children: "Odds" })] })] })] }), _jsxs("div", { className: "mt-4 flex flex-col md:flex-row items-center gap-2", children: [_jsxs("select", { className: "px-2 py-1 rounded border border-gray-300", value: selectedPreset, onChange: e => handleLoadPreset(e.target.value), children: [_jsx("option", { value: "", children: "Select Preset" }), presets.map(p => (_jsx("option", { value: p.name, children: p.name }, p.name)))] }), _jsx("button", { className: "ml-2 px-3 py-1 rounded bg-blue-500 text-white", disabled: !selectedPreset, onClick: handleRemovePreset, children: "Remove" }), _jsx("input", { className: "ml-4 px-2 py-1 rounded border border-gray-300", placeholder: "Preset name", type: "text", value: presetName, onChange: e => setPresetName(e.target.value) }), _jsx("button", { className: "ml-2 px-3 py-1 rounded bg-green-500 text-white", disabled: !presetName.trim(), onClick: handleSavePreset, children: "Save Preset" })] })] }));
});
BettingFilters.displayName = 'BettingFilters';
