// Temporary fix for API calls that cause unhandled promise rejections
// This fixes the immediate error until the main files can be updated

// Override the problematic API calls with working endpoints
if (typeof window !== "undefined") {
  // Monkey patch fetch to redirect broken endpoints to working ones
  const originalFetch = window.fetch;

  window.fetch = async (url, options) => {
    // Fix broken API endpoints
    if (typeof url === "string") {
      if (url.includes("/metrics/accuracy")) {
        url = url.replace(
          "/metrics/accuracy",
          "/api/ultra-accuracy/model-performance",
        );
      } else if (url.includes("/analytics/users/")) {
        url = url.replace(/\/analytics\/users\/.*/, "/api/analytics/advanced");
      } else if (url.includes("/health") && !url.includes("/api/")) {
        // Health endpoint is correct, no change needed
      }
    }

    try {
      const result = await originalFetch(url, options);
      return result;
    } catch (error) {
      console.error("API call failed:", url, error);
      throw error;
    }
  };
}

export default {};
