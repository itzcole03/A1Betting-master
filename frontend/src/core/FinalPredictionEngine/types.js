import { UnifiedError } from '../error/types';
export class FinalPredictionError extends UnifiedError {
    constructor(message, code = 'PREDICTION_ERROR', severity = 'ERROR', context) {
        super(message, code, severity, context);
    }
}
