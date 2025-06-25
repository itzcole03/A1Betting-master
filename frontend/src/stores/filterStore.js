import { create } from 'zustand';
const FILTER_PRESETS_KEY = 'betting-filter-presets';
function getPresetsFromStorage() {
    try {
        const raw = window.localStorage.getItem(FILTER_PRESETS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function savePresetsToStorage(presets) {
    window.localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(presets));
}
export const useFilterStore = create(set => ({
    activeFilters: new Set(),
    riskProfile: 'balanced',
    setRiskProfile: profile => set({ riskProfile: profile }),
    stakeSizing: 5,
    setStakeSizing: value => set({ stakeSizing: value }),
    model: 'default',
    setModel: model => set({ model }),
    confidenceThreshold: 0,
    setConfidenceThreshold: value => set({ confidenceThreshold: value }),
    toggleFilter: (filterId) => set(state => {
        const newFilters = new Set(state.activeFilters);
        if (newFilters.has(filterId)) {
            newFilters.delete(filterId);
        }
        else {
            newFilters.add(filterId);
        }
        return { activeFilters: newFilters };
    }),
    clearFilters: () => set({ activeFilters: new Set() }),
    savePreset: (name) => set(state => {
        const presets = getPresetsFromStorage();
        const newPreset = {
            name,
            filters: {
                activeFilters: Array.from(state.activeFilters),
                riskProfile: state.riskProfile,
                stakeSizing: state.stakeSizing,
                model: state.model,
                confidenceThreshold: state.confidenceThreshold,
            },
        };
        const updated = presets.filter(p => p.name !== name).concat(newPreset);
        savePresetsToStorage(updated);
        return {};
    }),
    loadPreset: (name) => set(state => {
        const presets = getPresetsFromStorage();
        const preset = presets.find(p => p.name === name);
        if (preset) {
            return {
                activeFilters: new Set(preset.filters.activeFilters),
                riskProfile: preset.filters.riskProfile,
                stakeSizing: preset.filters.stakeSizing,
                model: preset.filters.model,
                confidenceThreshold: preset.filters.confidenceThreshold,
            };
        }
        return {};
    }),
    removePreset: (name) => set(() => {
        const presets = getPresetsFromStorage().filter(p => p.name !== name);
        savePresetsToStorage(presets);
        return {};
    }),
    listPresets: () => getPresetsFromStorage(),
}));
