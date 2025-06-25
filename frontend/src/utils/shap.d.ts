import { ShapVector } from '../types/models.js';
/**
 * Calculate SHAP values for given features
 * This is a simplified implementation for demonstration
 */
export declare function calculateShap(features: Record<string, number>, modelType?: string): ShapVector;
/**
 * Aggregate multiple SHAP vectors into a single vector
 */
export declare function aggregateShapValues(shapVectors: ShapVector[]): ShapVector;
/**
 * Get top N most important features from SHAP values
 */
export declare function getTopShapFeatures(shapValues: ShapVector, n?: number): Array<{
    feature: string;
    importance: number;
}>;
