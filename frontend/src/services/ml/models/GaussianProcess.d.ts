interface GPConfig {
    kernel: 'rbf' | 'matern' | 'linear';
    noise: number;
    lengthScale?: number;
    signalVariance?: number;
}
export declare class GaussianProcess {
    private config;
    private X;
    private y;
    private K;
    private L;
    private alpha;
    constructor(config: GPConfig);
    fit(X: number[][], y: number[]): void;
    predict(X: number[]): [number, number];
    private computeKernelMatrix;
    private kernel;
    private rbfKernel;
    private maternKernel;
    private linearKernel;
    private cholesky;
    private solveTriangular;
}
export {};
