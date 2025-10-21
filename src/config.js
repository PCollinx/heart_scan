export const config = {
  /**
   * Backend API endpoint URL
   */
  API_ENDPOINT: "https://heart-disease-detector-lcij.onrender.com",

  /**
   * API endpoints paths
   */
  API_PATHS: {
    predict: "/predict",
    health: "/health", // Optional: health check endpoint
  },

  /**
   * Request timeout in milliseconds
   */
  REQUEST_TIMEOUT: 120000, // 2 minutes

  /**
   * Enable debug logging
   */
  DEBUG: true,

  /**
   * Form validation settings
   */
  VALIDATION: {
    AGE_MIN: 1,
    AGE_MAX: 120,
    CA_MIN: 0,
    CA_MAX: 4,
    BP_MIN: 80,
    BP_MAX: 200,
    CHOL_MIN: 100,
    CHOL_MAX: 600,
    THALACH_MIN: 60,
    THALACH_MAX: 220,
    OLDPEAK_MIN: 0,
    OLDPEAK_MAX: 10,
  },

  /**
   * Display settings
   */
  DISPLAY: {
    SCROLL_TO_RESULTS: true,
    AUTO_FOCUS_ERROR: true,
    SHOW_INPUT_SUMMARY: true,
  },
};

export default config;
