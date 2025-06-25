export var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (ErrorSeverity = {}));
export var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["SYSTEM"] = "SYSTEM";
    ErrorCategory["VALIDATION"] = "VALIDATION";
    ErrorCategory["NETWORK"] = "NETWORK";
    ErrorCategory["AUTH"] = "AUTH";
    ErrorCategory["BUSINESS"] = "BUSINESS";
    ErrorCategory["DATABASE"] = "DATABASE";
    ErrorCategory["CONFIGURATION"] = "CONFIGURATION";
    ErrorCategory["MODEL"] = "MODEL";
})(ErrorCategory || (ErrorCategory = {}));
export class UnifiedError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', severity = ErrorSeverity.MEDIUM, context) {
        super(message);
        this.code = code;
        this.severity = severity;
        this.context = context;
        this.name = 'UnifiedError';
    }
}
