import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
export const usePredictionStore = create()(devtools((set, get) => ({
    predictionsByEvent: {},
    updatePrediction: (eventId, data) => {
        set(state => ({
            predictionsByEvent: {
                ...state.predictionsByEvent,
                [eventId]: data,
            },
        }));
    },
    getPredictionForEvent: (eventId) => {
        return get().predictionsByEvent[eventId];
    },
    getLatestPredictions: () => {
        const predictions = get().predictionsByEvent;
        return Object.values(predictions).sort((a, b) => {
            const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return tb - ta;
        });
    },
}), { name: 'prediction-store' }));
