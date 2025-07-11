import { useState, useCallback } from 'react';
export function useErrorHandler(options = {}) {
    const [errorState, setErrorState] = useState({ error: null });
    const handleError = useCallback((error, info) => {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        setErrorState({ error: normalizedError, info });
        // Call the provided error handler if any
        options.onError?.(normalizedError, info);
        // Log error to console in development
        if (import.meta.env.MODE === 'development') {
            console.error('Error caught by useErrorHandler:', normalizedError, info);
        }
        // Optionally rethrow the error
        if (options.shouldRethrow) {
            throw normalizedError;
        }
    }, [options]);
    const clearError = useCallback(() => {
        setErrorState({ error: null });
    }, []);
    return {
        error: errorState.error,
        errorInfo: errorState.info,
        handleError,
        clearError,
        hasError: errorState.error !== null
    };
}
// Example usage:
// function MyComponent() {
//   const { error, handleError, clearError } = useErrorHandler({
//     onError: (error) => {
//       // Log to error tracking service
//       console.error('Component error:', error);
//     }
//   });
//
//   const handleRiskyOperation = async () => {
//     try {
//       await someRiskyOperation();
//     } catch (error) {
//       handleError(error);
//     }
//   };
//
//   if (error) {
//     return (
//       <div>
//         <p>Error: {error.message}</p>
//         <button onClick={clearError}>Dismiss</button>
//       </div>
//     );
//   }
//
//   return <button onClick={handleRiskyOperation}>Do Something Risky</button>;
// } 
