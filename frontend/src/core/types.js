export var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["SYSTEM"] = "SYSTEM";
    ErrorCategory["VALIDATION"] = "VALIDATION";
    ErrorCategory["NETWORK"] = "NETWORK";
    ErrorCategory["AUTH"] = "AUTH";
    ErrorCategory["BUSINESS"] = "BUSINESS";
    ErrorCategory["DATABASE"] = "DATABASE";
    ErrorCategory["CONFIGURATION"] = "CONFIGURATION";
})(ErrorCategory || (ErrorCategory = {}));
export var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (ErrorSeverity = {}));
