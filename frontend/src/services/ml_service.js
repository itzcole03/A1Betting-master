import { mlService } from './analytics/mlService';
export const useMLService = () => {
    return {
        getModelMetrics: mlService.getModelMetrics?.bind(mlService),
    };
};
