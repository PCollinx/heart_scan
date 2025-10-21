import { mapFormDataToAPI, makePrediction } from "./api.js";
import config from "../config.js";

// Tooltip content for each field
const tooltipContent = {
  age: {
    title: "Age",
    body: `<p><strong>What it means:</strong> Your age in years.</p>
           <p><strong>Why it matters:</strong> Risk of heart disease increases with age. Most heart attacks occur in people over 65.</p>
           <p><strong>Valid range:</strong> 1-120 years</p>`,
  },
  sex: {
    title: "Biological Sex",
    body: `<p><strong>What it means:</strong> Your biological sex assigned at birth.</p>
           <p><strong>Why it matters:</strong> Men are generally at higher risk for heart disease at younger ages. Women's risk increases after menopause.</p>
           <ul>
             <li><strong>Male (1):</strong> Typically higher risk</li>
             <li><strong>Female (0):</strong> Risk increases after age 55</li>
           </ul>`,
  },
  chestPain: {
    title: "Chest Pain Type",
    body: `<p><strong>What it means:</strong> The type of chest discomfort you experience.</p>
           <ul>
             <li><strong>Typical Angina:</strong> Classic heart-related chest pain during exertion, relieved by rest</li>
             <li><strong>Atypical Angina:</strong> Chest pain with unusual features</li>
             <li><strong>Non-anginal:</strong> Chest pain not related to the heart</li>
             <li><strong>Asymptomatic:</strong> No chest pain symptoms</li>
           </ul>
           <p><strong>Why it matters:</strong> Typical angina is a strong indicator of coronary artery disease.</p>`,
  },
  restingBloodPressure: {
    title: "Resting Blood Pressure",
    body: `<p><strong>What it means:</strong> Your systolic blood pressure (top number) measured at rest in mm Hg.</p>
           <p><strong>Normal ranges:</strong></p>
           <ul>
             <li><strong>Normal:</strong> Less than 120 mm Hg</li>
             <li><strong>Elevated:</strong> 120-129 mm Hg</li>
             <li><strong>High (Stage 1):</strong> 130-139 mm Hg</li>
             <li><strong>High (Stage 2):</strong> 140+ mm Hg</li>
           </ul>
           <p><strong>Why it matters:</strong> High blood pressure damages arteries and increases heart disease risk.</p>`,
  },
  serumCholesterol: {
    title: "Serum Cholesterol",
    body: `<p><strong>What it means:</strong> Total cholesterol level in your blood measured in mg/dl.</p>
           <p><strong>Healthy ranges:</strong></p>
           <ul>
             <li><strong>Desirable:</strong> Less than 200 mg/dl</li>
             <li><strong>Borderline:</strong> 200-239 mg/dl</li>
             <li><strong>High:</strong> 240+ mg/dl</li>
           </ul>
           <p><strong>Why it matters:</strong> High cholesterol leads to plaque buildup in arteries, increasing heart attack risk.</p>`,
  },
  fastingBloodSugar: {
    title: "Fasting Blood Sugar",
    body: `<p><strong>What it means:</strong> Blood sugar level after 8+ hours of fasting.</p>
           <ul>
             <li><strong>Normal:</strong> Less than 100 mg/dl</li>
             <li><strong>Prediabetes:</strong> 100-125 mg/dl</li>
             <li><strong>Diabetes:</strong> 126+ mg/dl</li>
           </ul>
           <p><strong>Why it matters:</strong> Elevated blood sugar (>120 mg/dl) indicates diabetes, which significantly increases heart disease risk.</p>`,
  },
  restingECG: {
    title: "Resting Electrocardiogram (ECG)",
    body: `<p><strong>What it means:</strong> Results from an electrical recording of your heart at rest.</p>
           <ul>
             <li><strong>Normal:</strong> No abnormalities detected</li>
             <li><strong>Abnormal:</strong> ST-T wave changes or left ventricular hypertrophy (enlarged heart muscle)</li>
           </ul>
           <p><strong>Why it matters:</strong> Abnormal ECG can indicate heart strain, previous heart attacks, or other cardiac issues.</p>`,
  },
  maxHeartRate: {
    title: "Maximum Heart Rate Achieved",
    body: `<p><strong>What it means:</strong> The highest heart rate achieved during an exercise stress test, measured in beats per minute (bpm).</p>
           <p><strong>Expected maximum:</strong> Approximately 220 minus your age</p>
           <p><strong>Example:</strong> If you're 40 years old, expected max ≈ 180 bpm</p>
           <p><strong>Why it matters:</strong> Lower than expected maximum heart rate may indicate poor cardiovascular fitness or heart problems.</p>`,
  },
  exerciseAngina: {
    title: "Exercise-Induced Angina",
    body: `<p><strong>What it means:</strong> Whether you experience chest pain during physical exertion.</p>
           <ul>
             <li><strong>Yes:</strong> Chest pain occurs during exercise</li>
             <li><strong>No:</strong> No chest pain during exercise</li>
           </ul>
           <p><strong>Why it matters:</strong> Exercise-induced chest pain is a significant indicator of coronary artery disease. The heart needs more oxygen during exercise, and narrowed arteries can't supply enough.</p>`,
  },
  stDepression: {
    title: "ST Depression (Oldpeak)",
    body: `<p><strong>What it means:</strong> The depression of the ST segment on an ECG during exercise compared to rest.</p>
           <p><strong>Measured in:</strong> Millimeters (mm) or units</p>
           <p><strong>Normal:</strong> 0 or minimal depression</p>
           <p><strong>Concerning:</strong> Greater than 2.0 mm</p>
           <p><strong>Why it matters:</strong> ST depression indicates the heart isn't getting enough oxygen during exercise, suggesting blocked coronary arteries.</p>`,
  },
  slopeSTSegment: {
    title: "Slope of Peak Exercise ST Segment",
    body: `<p><strong>What it means:</strong> The slope or trend of the ST segment at peak exercise on an ECG.</p>
           <ul>
             <li><strong>Upsloping:</strong> Rising ST segment (typically normal)</li>
             <li><strong>Flat:</strong> Level ST segment (mild concern)</li>
             <li><strong>Downsloping:</strong> Declining ST segment (most concerning)</li>
           </ul>
           <p><strong>Why it matters:</strong> Downsloping ST segment is strongly associated with significant coronary artery disease.</p>`,
  },
  numMajorVessels: {
    title: "Number of Major Vessels",
    body: `<p><strong>What it means:</strong> Number of major coronary arteries (0-4) with significant blockage visible on fluoroscopy (a type of X-ray imaging).</p>
           <p><strong>Major vessels include:</strong></p>
           <ul>
             <li>Left anterior descending artery</li>
             <li>Left circumflex artery</li>
             <li>Right coronary artery</li>
             <li>Left main coronary artery</li>
           </ul>
           <p><strong>Why it matters:</strong> More blocked vessels = higher risk of heart attack and need for intervention.</p>
           <p><strong>Note:</strong> Enter 0 if this test wasn't performed.</p>`,
  },
  thalassemia: {
    title: "Thalassemia (Thallium Stress Test)",
    body: `<p><strong>What it means:</strong> Results from a thallium stress test showing blood flow to the heart muscle.</p>
           <ul>
             <li><strong>Normal:</strong> Normal blood flow throughout heart</li>
             <li><strong>Fixed Defect:</strong> Permanent defect from past heart damage (scar tissue)</li>
             <li><strong>Reversible Defect:</strong> Temporary defect during stress, indicating blocked artery but alive muscle</li>
           </ul>
           <p><strong>Why it matters:</strong> Defects indicate areas of the heart not receiving adequate blood flow, suggesting coronary artery disease.</p>`,
  },
};

// Track field completion for progress bar
let completedFields = new Set();
const totalFields = 13;

// Initialize form handling
export function initPredictionForm() {
  const form = document.getElementById("prediction-form");
  const submitButton = document.getElementById("submit-btn");
  const resetButton = document.getElementById("reset-btn");

  if (!form) {
    console.error("Prediction form not found");
    return;
  }

  // Initialize tooltips
  initTooltips();

  // Initialize field validation
  initFieldValidation();

  // Initialize progress tracking
  initProgressTracking();

  // Form submission
  form.addEventListener("submit", handleFormSubmit);

  // Reset button
  if (resetButton) {
    resetButton.addEventListener("click", handleReset);
  }
}

/**
 * Initialize tooltip functionality
 */
function initTooltips() {
  const tooltipTriggers = document.querySelectorAll(".tooltip-trigger");
  const modal = document.getElementById("tooltip-modal");
  const closeBtn = document.getElementById("tooltip-close");
  const overlay = modal?.querySelector(".tooltip-modal-overlay");

  tooltipTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const fieldName = trigger.dataset.tooltip;
      showTooltip(fieldName);
    });
  });

  // Close modal
  [closeBtn, overlay].forEach((element) => {
    element?.addEventListener("click", () => {
      modal?.classList.remove("show");
      modal?.classList.add("hidden");
    });
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      modal.classList.remove("show");
      modal.classList.add("hidden");
    }
  });
}

/**
 * Show tooltip modal
 */
function showTooltip(fieldName) {
  const modal = document.getElementById("tooltip-modal");
  const title = document.getElementById("tooltip-title");
  const body = document.getElementById("tooltip-body");

  if (!modal || !tooltipContent[fieldName]) return;

  title.textContent = tooltipContent[fieldName].title;
  body.innerHTML = tooltipContent[fieldName].body;

  modal.classList.remove("hidden");
  modal.classList.add("show");
}

/**
 * Initialize field validation
 */
function initFieldValidation() {
  const form = document.getElementById("prediction-form");
  const inputs = form.querySelectorAll("input, select");

  inputs.forEach((input) => {
    // Validate on blur
    input.addEventListener("blur", () => {
      validateField(input);
    });

    // Clear error on focus
    input.addEventListener("focus", () => {
      clearFieldError(input);
    });

    // Validate on change for immediate feedback
    input.addEventListener("change", () => {
      validateField(input);
      updateProgress();
    });

    // For number inputs, validate on input
    if (input.type === "number") {
      input.addEventListener("input", () => {
        if (input.value) {
          validateField(input);
        }
      });
    }
  });
}

/**
 * Initialize progress tracking
 */
function initProgressTracking() {
  updateProgress();
}

/**
 * Update progress bar
 */
function updateProgress() {
  const form = document.getElementById("prediction-form");
  const inputs = form.querySelectorAll("input[required], select[required]");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  completedFields.clear();

  inputs.forEach((input) => {
    if (input.value && input.value !== "") {
      // Check if value is valid
      if (input.type === "number") {
        const val = parseFloat(input.value);
        const min = input.min ? parseFloat(input.min) : -Infinity;
        const max = input.max ? parseFloat(input.max) : Infinity;
        if (val >= min && val <= max) {
          completedFields.add(input.name);
        }
      } else {
        completedFields.add(input.name);
      }
    }
  });

  const progress = (completedFields.size / totalFields) * 100;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  if (progressText) {
    progressText.textContent = `${completedFields.size} of ${totalFields} fields completed`;
  }
}

/**
 * Validate individual field
 */
function validateField(input) {
  const value = input.value;
  const name = input.name;
  let isValid = true;
  let errorMessage = "";

  // Check if field is empty
  if (!value || value === "") {
    if (input.hasAttribute("required")) {
      isValid = false;
      errorMessage = "This field is required";
    }
  } else {
    // Validate based on field name
    switch (name) {
      case "age":
        const age = parseInt(value);
        if (
          age < config.VALIDATION.AGE_MIN ||
          age > config.VALIDATION.AGE_MAX
        ) {
          isValid = false;
          errorMessage = `Age must be between ${config.VALIDATION.AGE_MIN} and ${config.VALIDATION.AGE_MAX}`;
        }
        break;

      case "restingBloodPressure":
        const bp = parseInt(value);
        if (bp < config.VALIDATION.BP_MIN || bp > config.VALIDATION.BP_MAX) {
          isValid = false;
          errorMessage = `Blood pressure must be between ${config.VALIDATION.BP_MIN} and ${config.VALIDATION.BP_MAX} mm Hg`;
        }
        break;

      case "serumCholesterol":
        const chol = parseInt(value);
        if (
          chol < config.VALIDATION.CHOL_MIN ||
          chol > config.VALIDATION.CHOL_MAX
        ) {
          isValid = false;
          errorMessage = `Cholesterol must be between ${config.VALIDATION.CHOL_MIN} and ${config.VALIDATION.CHOL_MAX} mg/dl`;
        }
        break;

      case "maxHeartRate":
        const hr = parseInt(value);
        if (
          hr < config.VALIDATION.THALACH_MIN ||
          hr > config.VALIDATION.THALACH_MAX
        ) {
          isValid = false;
          errorMessage = `Heart rate must be between ${config.VALIDATION.THALACH_MIN} and ${config.VALIDATION.THALACH_MAX} bpm`;
        }
        break;

      case "stDepression":
        const st = parseFloat(value);
        if (
          st < config.VALIDATION.OLDPEAK_MIN ||
          st > config.VALIDATION.OLDPEAK_MAX
        ) {
          isValid = false;
          errorMessage = `ST Depression must be between ${config.VALIDATION.OLDPEAK_MIN} and ${config.VALIDATION.OLDPEAK_MAX}`;
        }
        break;

      case "numMajorVessels":
        const ca = parseInt(value);
        if (ca < config.VALIDATION.CA_MIN || ca > config.VALIDATION.CA_MAX) {
          isValid = false;
          errorMessage = `Number of vessels must be between ${config.VALIDATION.CA_MIN} and ${config.VALIDATION.CA_MAX}`;
        }
        break;
    }
  }

  // Show error or mark as valid
  if (!isValid) {
    showFieldError(input, errorMessage);
    input.classList.add("error");
    input.classList.remove("valid");
  } else if (value && value !== "") {
    input.classList.remove("error");
    input.classList.add("valid");
    clearFieldError(input);
  }

  return isValid;
}

/**
 * Show field-specific error
 */
function showFieldError(input, message) {
  const errorDiv = document.getElementById(`${input.name}-error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add("show");
  }
}

/**
 * Clear field error
 */
function clearFieldError(input) {
  const errorDiv = document.getElementById(`${input.name}-error`);
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.remove("show");
  }
  input.classList.remove("error");
}

/**
 * Handles form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-text");

  // Get form data
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  // Validate all fields
  const inputs = form.querySelectorAll("input[required], select[required]");
  let isValid = true;
  let firstInvalidField = null;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    }
  });

  if (!isValid) {
    showError(
      "Please fill in all required fields correctly. Check the highlighted fields above.",
      "warning"
    );

    // Scroll to first invalid field
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidField.focus();
    }
    return;
  }

  try {
    // Show loading state
    setLoadingState(submitButton, submitText, true);
    hideError();
    hideResults();

    // Map form data to API format
    const apiData = mapFormDataToAPI(formValues);

    console.log("Sending data to API:", apiData);

    // Make prediction
    const result = await makePrediction(apiData);

    console.log("Prediction result:", result);

    // Display results
    displayResults(result, formValues);
  } catch (error) {
    console.error("Error making prediction:", error);
    showError(
      "Failed to get prediction. Please check your API connection and try again. Error: " +
        error.message,
      "error"
    );
  } finally {
    setLoadingState(submitButton, submitText, false);
  }
}

/**
 * Handle form reset
 */
function handleReset() {
  const form = document.getElementById("prediction-form");
  if (!form) return;

  // Reset form
  form.reset();

  // Clear all field states
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.classList.remove("error", "valid");
    clearFieldError(input);
  });

  // Reset progress
  completedFields.clear();
  updateProgress();

  // Hide results
  hideResults();
  hideError();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Sets loading state for submit button
 */
function setLoadingState(button, textElement, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    if (textElement) {
      textElement.textContent = "Analyzing...";
    }
    button.classList.add("opacity-70", "cursor-not-allowed");
  } else {
    button.disabled = false;
    if (textElement) {
      textElement.textContent = "Analyze Risk";
    }
    button.classList.remove("opacity-70", "cursor-not-allowed");
  }
}

/**
 * Displays prediction results
 * @param {Object} result - API result
 * @param {Object} formValues - Original form values for context
 */
function displayResults(result, formValues) {
  // Get or create results container
  let resultsContainer = document.getElementById("prediction-results");

  if (!resultsContainer) {
    resultsContainer = createResultsContainer();
  }

  // Determine risk level and message based on prediction
  const hasDiseaseRisk = result.prediction === 1 || result.prediction > 0;
  const probability = result.probability || result.confidence || 0;

  const riskLevel = hasDiseaseRisk ? "HIGH" : "LOW";
  const riskColor = hasDiseaseRisk ? "red" : "green";
  const riskBg = hasDiseaseRisk ? "bg-red-50" : "bg-green-50";
  const riskMessage = hasDiseaseRisk
    ? "Our analysis indicates an elevated risk of heart disease. Please consult with a healthcare professional for proper evaluation and personalized advice."
    : "Our analysis indicates a lower risk of heart disease. Continue maintaining a healthy lifestyle with regular exercise, balanced diet, and routine check-ups.";

  resultsContainer.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 mt-8 animate-fadeIn border-t-4 border-${riskColor}-500">
      <div class="flex items-center gap-3 mb-6">
        <span class="material-symbols-outlined text-5xl text-${riskColor}-500">
          ${hasDiseaseRisk ? "warning" : "check_circle"}
        </span>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Prediction Results</h3>
          <p class="text-sm text-gray-600">Based on your health information</p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-6">
        <div class="${riskBg} border-l-4 border-${riskColor}-500 rounded-r-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-semibold text-gray-700">Risk Assessment:</span>
            <span class="text-3xl font-bold text-${riskColor}-600">${riskLevel} RISK</span>
          </div>
          ${
            probability > 0
              ? `
          <div class="flex items-center justify-between mb-4">
            <span class="text-base font-medium text-gray-700">Model Confidence:</span>
            <span class="text-2xl font-bold text-gray-800">${(
              probability * 100
            ).toFixed(1)}%</span>
          </div>
          `
              : ""
          }
          <p class="text-gray-700 text-base leading-relaxed">${riskMessage}</p>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 mb-6">
          <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600">info</span>
            Important Medical Disclaimer
          </h4>
          <p class="text-sm text-blue-800 leading-relaxed">
            This prediction is based on machine learning analysis and is for educational and informational purposes only. 
            It should <strong>NOT</strong> be considered a medical diagnosis or replace professional medical advice. 
            Always consult with qualified healthcare professionals for proper medical evaluation, diagnosis, and treatment.
          </p>
        </div>
        
        ${
          config.DISPLAY.SHOW_INPUT_SUMMARY
            ? `
        <div class="bg-gray-50 rounded-lg p-5 mb-6">
          <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-600">summarize</span>
            Your Input Summary
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">Age:</span>
              <span class="font-semibold text-gray-900">${
                formValues.age
              } years</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">Sex:</span>
              <span class="font-semibold text-gray-900">${
                formValues.sex === "male" ? "Male" : "Female"
              }</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">Blood Pressure:</span>
              <span class="font-semibold text-gray-900">${
                formValues.restingBloodPressure
              } mmHg</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">Cholesterol:</span>
              <span class="font-semibold text-gray-900">${
                formValues.serumCholesterol
              } mg/dl</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">Max Heart Rate:</span>
              <span class="font-semibold text-gray-900">${
                formValues.maxHeartRate
              } bpm</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="font-medium text-gray-600">ST Depression:</span>
              <span class="font-semibold text-gray-900">${
                formValues.stDepression
              }</span>
            </div>
          </div>
        </div>
        `
            : ""
        }
        
        <div class="flex flex-col sm:flex-row gap-3">
          <button onclick="window.print()" 
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">print</span>
            Print Results
          </button>
          <button onclick="document.getElementById('prediction-results').remove(); document.getElementById('prediction-form').reset(); document.querySelectorAll('.form-input').forEach(i => i.classList.remove('valid', 'error')); window.location.reload();" 
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">refresh</span>
            New Assessment
          </button>
        </div>
      </div>
    </div>
  `;

  resultsContainer.classList.remove("hidden");

  // Scroll to results if enabled in config
  if (config.DISPLAY.SCROLL_TO_RESULTS) {
    setTimeout(() => {
      resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

/**
 * Creates results container element
 */
function createResultsContainer() {
  const container = document.createElement("div");
  container.id = "prediction-results";
  container.className = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8";

  const formContainer = document.querySelector(".form-container");
  if (formContainer && formContainer.parentNode) {
    formContainer.parentNode.insertBefore(
      container,
      formContainer.parentNode.lastChild
    );
  }

  return container;
}

/**
 * Hides results container
 */
function hideResults() {
  const resultsContainer = document.getElementById("prediction-results");
  if (resultsContainer) {
    resultsContainer.classList.add("hidden");
  }
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 * @param {string} type - Type of error: "error" or "warning"
 */
function showError(message, type = "error") {
  let errorContainer = document.getElementById("prediction-error");

  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.id = "prediction-error";
    errorContainer.className = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6";

    const formContainer = document.querySelector(".form-container");
    if (formContainer && formContainer.parentNode) {
      formContainer.parentNode.insertBefore(errorContainer, formContainer);
    }
  }

  const bgColor = type === "warning" ? "bg-yellow-50" : "bg-red-50";
  const borderColor =
    type === "warning" ? "border-yellow-500" : "border-red-500";
  const textColor = type === "warning" ? "text-yellow-800" : "text-red-800";
  const iconColor = type === "warning" ? "text-yellow-600" : "text-red-600";
  const icon = type === "warning" ? "warning" : "error";

  errorContainer.innerHTML = `
    <div class="${bgColor} border-l-4 ${borderColor} rounded-r-lg p-4 flex items-start gap-3 shadow-md animate-shake">
      <span class="material-symbols-outlined ${iconColor} text-2xl">${icon}</span>
      <div class="flex-1">
        <h4 class="font-semibold ${textColor} mb-1">${
    type === "warning" ? "Validation Error" : "Error"
  }</h4>
        <p class="${textColor} text-sm leading-relaxed">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="${iconColor} hover:opacity-70 transition-opacity">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  `;

  errorContainer.classList.remove("hidden");

  // Scroll to error
  errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Hides error message
 */
function hideError() {
  const errorContainer = document.getElementById("prediction-error");
  if (errorContainer) {
    errorContainer.remove();
  }
}
