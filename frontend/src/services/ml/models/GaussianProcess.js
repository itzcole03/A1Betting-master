export class GaussianProcess {
    constructor(config) {
        this.X = [];
        this.y = [];
        this.K = [];
        this.L = [];
        this.alpha = [];
        this.config = {
            lengthScale: 1.0,
            signalVariance: 1.0,
            ...config,
        };
    }
    fit(X, y) {
        this.X = X;
        this.y = y;
        // Compute kernel matrix
        this.K = this.computeKernelMatrix(X, X);
        // Add noise to diagonal
        for (let i = 0; i < this.K.length; i++) {
            this.K[i][i] += this.config.noise;
        }
        // Compute Cholesky decomposition
        this.L = this.cholesky(this.K);
        // Solve for alpha
        this.alpha = this.solveTriangular(this.L, this.y);
    }
    predict(X) {
        if (this.X.length === 0) {
            return [0, this.config.signalVariance];
        }
        // Compute kernel between test point and training points
        const k = this.X.map(x => this.kernel(X, x));
        // Compute mean
        const mean = k.reduce((sum, ki, i) => sum + ki * this.alpha[i], 0);
        // Compute variance
        const v = this.solveTriangular(this.L, k);
        const variance = this.kernel(X, X) - v.reduce((sum, vi) => sum + vi * vi, 0);
        return [mean, Math.max(0, variance)];
    }
    computeKernelMatrix(X1, X2) {
        const n1 = X1.length;
        const n2 = X2.length;
        const K = Array(n1)
            .fill(null)
            .map(() => Array(n2).fill(0));
        for (let i = 0; i < n1; i++) {
            for (let j = 0; j < n2; j++) {
                K[i][j] = this.kernel(X1[i], X2[j]);
            }
        }
        return K;
    }
    kernel(x1, x2) {
        switch (this.config.kernel) {
            case 'rbf':
                return this.rbfKernel(x1, x2);
            case 'matern':
                return this.maternKernel(x1, x2);
            case 'linear':
                return this.linearKernel(x1, x2);
            default:
                throw new Error(`Unknown kernel type: ${this.config.kernel}`);
        }
    }
    rbfKernel(x1, x2) {
        const diff = x1.map((xi, i) => xi - x2[i]);
        const squaredDist = diff.reduce((sum, d) => sum + d * d, 0);
        return (this.config.signalVariance *
            Math.exp((-0.5 * squaredDist) / (this.config.lengthScale * this.config.lengthScale)));
    }
    maternKernel(x1, x2) {
        const diff = x1.map((xi, i) => xi - x2[i]);
        const dist = Math.sqrt(diff.reduce((sum, d) => sum + d * d, 0));
        const scaledDist = (Math.sqrt(3) * dist) / this.config.lengthScale;
        return this.config.signalVariance * (1 + scaledDist) * Math.exp(-scaledDist);
    }
    linearKernel(x1, x2) {
        return this.config.signalVariance * x1.reduce((sum, xi, i) => sum + xi * x2[i], 0);
    }
    cholesky(A) {
        const n = A.length;
        const L = Array(n)
            .fill(null)
            .map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                if (j === i) {
                    for (let k = 0; k < j; k++) {
                        sum += L[j][k] * L[j][k];
                    }
                    L[j][j] = Math.sqrt(A[j][j] - sum);
                }
                else {
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * L[j][k];
                    }
                    L[i][j] = (A[i][j] - sum) / L[j][j];
                }
            }
        }
        return L;
    }
    solveTriangular(L, b) {
        const n = L.length;
        const x = Array(n).fill(0);
        // Forward substitution
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i][j] * x[j];
            }
            x[i] = (b[i] - sum) / L[i][i];
        }
        return x;
    }
}
