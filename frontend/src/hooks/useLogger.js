import React, { createContext, useContext } from "react";
const LoggerContext = createContext(undefined);
export const useLogger = () => {
  const context = useContext(LoggerContext);

  // If no provider, return a simple console logger
  if (!context) {
    return {
      log: (message) => console.log(message),
      error: (message) => console.error(message),
      warn: (message) => console.warn(message),
      info: (message) => console.info(message),
    };
  }

  return context;
};
export const LoggerProvider = ({ children }) => {
  const logger = {
    log: (message) => console.log(message),
    error: (message) => console.error(message),
    warn: (message) => console.warn(message),
    info: (message) => console.info(message),
  };
  return React.createElement(
    LoggerContext.Provider,
    { value: logger },
    children,
  );
};
