// Simple logger hook that doesn't require a provider
export const useSimpleLogger = (componentName?: string) => {
  const prefix = componentName ? `[${componentName}]` : "";

  return {
    log: (message: string) => console.log(`${prefix} ${message}`),
    error: (message: string) => console.error(`${prefix} ${message}`),
    warn: (message: string) => console.warn(`${prefix} ${message}`),
    info: (message: string) => console.info(`${prefix} ${message}`),
    debug: (message: string) => console.debug(`${prefix} ${message}`),
  };
};

export default useSimpleLogger;
