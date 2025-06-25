/**
 * Patch for MUI onClick issues
 * This utility patches common MUI onClick errors that occur when onClick handlers are not functions
 */

/**
 * Patches MUI components to handle invalid onClick handlers gracefully
 */
export const initializeMUIClickPatch = () => {
  // Patch for common DOM event handling
  if (typeof window !== "undefined") {
    // Store original addEventListener
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // Override addEventListener to wrap onClick handlers
    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options,
    ) {
      if (type === "click" && typeof listener === "function") {
        const wrappedListener = function (event: Event) {
          try {
            // Call the original listener
            listener.call(this, event);
          } catch (error) {
            if (
              error instanceof TypeError &&
              error.message.includes("onClick is not a function")
            ) {
              console.warn("onClick error caught and handled:", error);
              // Prevent error from propagating
              event.stopPropagation();
              event.preventDefault();
              return false;
            }
            // Re-throw other errors
            throw error;
          }
        };

        // Call original addEventListener with wrapped listener
        return originalAddEventListener.call(
          this,
          type,
          wrappedListener,
          options,
        );
      }

      // For non-click events, use original addEventListener
      return originalAddEventListener.call(this, type, listener, options);
    };

    console.debug("MUI onClick patch initialized");
  }
};

/**
 * Creates a safe wrapper for MUI component props that validates onClick handlers
 */
export const safeMUIProps = <T extends { onClick?: () => void }>(
  props: T,
): T => {
  const safeProps = { ...props };

  if ("onClick" in safeProps) {
    if (typeof safeProps.onClick === "function") {
      // Wrap valid function in error handler
      const originalOnClick = safeProps.onClick;
      safeProps.onClick = () => {
        try {
          originalOnClick();
        } catch (error) {
          console.error("Error in onClick handler:", error);
        }
      };
    } else if (safeProps.onClick !== undefined) {
      // Remove invalid onClick
      console.warn(
        "Invalid onClick prop detected and removed:",
        typeof safeProps.onClick,
      );
      delete safeProps.onClick;
    }
  }

  return safeProps;
};
