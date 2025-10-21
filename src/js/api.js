/**
 * API Service for Heart Disease Prediction
 */

import config from "../config.js";

// API Configuration
const API_CONFIG = {
  baseURL: config.API_ENDPOINT,
  endpoints: config.API_PATHS,
  timeout: config.REQUEST_TIMEOUT,
};

/**
 * Maps form values to API expected format
 * @param {Object} formData - Raw form data
 * @returns {Object} - Formatted data for API
 */
export function mapFormDataToAPI(formData) {
  // Map sex values
  const sexMap = {
    male: 1,
    female: 0,
  };

  // Map chest pain type values
  const chestPainMap = {
    typical: 0,
    atypical: 1,
    "non-anginal": 2,
    asymptomatic: 3,
  };

  // Map fasting blood sugar values
  const fbsMap = {
    greater_than_120: 1,
    less_than_120: 0,
  };

  // Map resting ECG values
  const restECGMap = {
    normal: 0,
    abnormal: 1,
  };

  // Map exercise angina values
  const exangMap = {
    yes: 1,
    no: 0,
  };

  // Map slope values
  const slopeMap = {
    upsloping: 0,
    flat: 1,
    downsloping: 2,
  };

  // Map thalassemia values
  const thalMap = {
    normal: 1,
    carrier: 2,
    deficient: 3,
  };

  return {
    features: {
      age: parseInt(formData.age),
      sex: sexMap[formData.sex],
      cp: chestPainMap[formData.chestPain],
      trestbps: parseInt(formData.restingBloodPressure),
      chol: parseInt(formData.serumCholesterol),
      fbs: fbsMap[formData.fastingBloodSugar],
      restecg: restECGMap[formData.restingECG],
      thalach: parseInt(formData.maxHeartRate),
      exang: exangMap[formData.exerciseAngina],
      oldpeak: parseFloat(formData.stDepression),
      slope: slopeMap[formData.slopeSTSegment],
      ca: parseInt(formData.numMajorVessels),
      thal: thalMap[formData.thalassemia],
    },
  };
}

/**
 * Makes prediction request to API
 * @param {Object} data - Formatted data for prediction
 * @returns {Promise<Object>} - Prediction result
 */
export async function makePrediction(data) {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    if (config.DEBUG) {
      console.log(
        "Making prediction request to:",
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.predict}`
      );
      console.log("Request payload:", data);
    }

    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.predict}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (config.DEBUG) {
      console.log("Prediction response:", result);
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout. Please check your internet connection and try again."
      );
    }

    console.error("Prediction error:", error);
    throw error;
  }
}

/**
 * Updates the API base URL
 * @param {string} url - New base URL
 */
export function setAPIBaseURL(url) {
  API_CONFIG.baseURL = url;
}

/**
 * Gets the current API configuration
 * @returns {Object} - Current API config
 */
export function getAPIConfig() {
  return { ...API_CONFIG };
}
