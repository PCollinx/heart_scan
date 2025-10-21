# Heart Disease Prediction - API Integration Guide

This document explains how to integrate your heart disease prediction API with the frontend application.

## 📋 Table of Contents

- [API Endpoint Configuration](#api-endpoint-configuration)
- [Expected API Format](#expected-api-format)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Testing the Integration](#testing-the-integration)
- [Troubleshooting](#troubleshooting)

## 🔧 API Endpoint Configuration

### Step 1: Update the API URL

Open the file `/src/config.js` and update the `API_ENDPOINT` with your backend URL:

```javascript
export const config = {
  // For local development
  API_ENDPOINT: "http://localhost:5000",

  // For production (replace with your actual API URL)
  // API_ENDPOINT: 'https://api.yourdomain.com',

  // ...
};
```

### Step 2: Verify API Path

Make sure the predict endpoint path matches your backend:

```javascript
API_PATHS: {
  predict: '/predict',  // Change this if your endpoint is different
}
```

## 📤 Request Format

The frontend sends a POST request to your API with the following JSON structure:

```json
{
  "features": {
    "age": 30,
    "sex": 1,
    "cp": 3,
    "trestbps": 100,
    "chol": 200,
    "fbs": 1,
    "restecg": 0,
    "thalach": 100,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 0,
    "ca": 0,
    "thal": 1
  }
}
```

### Field Mappings

The form automatically maps user-friendly values to the numeric format expected by the API:

| Field        | Form Value                                              | API Value     | Description                       |
| ------------ | ------------------------------------------------------- | ------------- | --------------------------------- |
| **age**      | Number (1-120)                                          | Integer       | Age in years                      |
| **sex**      | "male" / "female"                                       | 1 / 0         | Sex (1 = male, 0 = female)        |
| **cp**       | "typical" / "atypical" / "non-anginal" / "asymptomatic" | 0 / 1 / 2 / 3 | Chest pain type                   |
| **trestbps** | Number (80-200)                                         | Integer       | Resting blood pressure (mmHg)     |
| **chol**     | Number (100-600)                                        | Integer       | Serum cholesterol (mg/dl)         |
| **fbs**      | "greater_than_120" / "less_than_120"                    | 1 / 0         | Fasting blood sugar > 120 mg/dl   |
| **restecg**  | "normal" / "abnormal"                                   | 0 / 1         | Resting ECG results               |
| **thalach**  | Number (60-220)                                         | Integer       | Maximum heart rate achieved       |
| **exang**    | "yes" / "no"                                            | 1 / 0         | Exercise induced angina           |
| **oldpeak**  | Number (0-10)                                           | Float         | ST depression induced by exercise |
| **slope**    | "upsloping" / "flat" / "downsloping"                    | 0 / 1 / 2     | Slope of peak exercise ST segment |
| **ca**       | Number (0-4)                                            | Integer       | Number of major vessels           |
| **thal**     | "normal" / "carrier" / "deficient"                      | 1 / 2 / 3     | Thalassemia                       |

## 📥 Response Format

Your API should return a JSON response in one of these formats:

### Option 1: Simple Prediction

```json
{
  "prediction": 1,
  "probability": 0.85
}
```

### Option 2: Detailed Response

```json
{
  "prediction": 1,
  "confidence": 0.85,
  "risk_level": "high",
  "message": "High risk of heart disease detected"
}
```

### Response Fields

- `prediction`: Integer (0 or 1, or higher numbers for multi-class)
  - `0` = No heart disease / Low risk
  - `1` or higher = Heart disease detected / High risk
- `probability` or `confidence`: Float (0.0 to 1.0) - Prediction confidence score
- `risk_level` (optional): String - "low" or "high"
- `message` (optional): String - Custom message to display

## 🧪 Testing the Integration

### 1. Start Your Backend API

Make sure your backend API is running and accessible at the configured endpoint.

### 2. Start the Frontend Development Server

```bash
npm run dev
```

### 3. Test the Form

1. Navigate to the prediction page: `http://localhost:5173/src/pages/predict.html`
2. Fill in the form with test data
3. Click "Predict"
4. Check the browser console for any errors

### 4. Sample Test Data

Use this sample data for testing:

- **Age**: 63
- **Sex**: Male
- **Chest Pain Type**: Typical Angina
- **Resting Blood Pressure**: 145
- **Serum Cholesterol**: 233
- **Fasting Blood Sugar**: Greater than 120 mg/dl
- **Resting ECG**: Normal
- **Max Heart Rate**: 150
- **Exercise Angina**: No
- **ST Depression**: 2.3
- **Slope**: Downsloping
- **Number of Major Vessels**: 0
- **Thalassemia**: Normal

This should send the following to your API:

```json
{
  "features": {
    "age": 63,
    "sex": 1,
    "cp": 0,
    "trestbps": 145,
    "chol": 233,
    "fbs": 1,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 2,
    "ca": 0,
    "thal": 1
  }
}
```

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in the console, your backend needs to enable CORS. For Flask:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

Or enable CORS for specific origins:

```python
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})
```

### Connection Refused

- Verify your backend is running
- Check that the API URL in `config.js` matches your backend
- Ensure no firewall is blocking the connection

### 404 Not Found

- Verify the endpoint path in `config.js` matches your backend route
- Check your backend logs for the incoming request

### Invalid Response Format

- Ensure your API returns JSON
- Check that the response includes at least `prediction` field
- Verify the Content-Type header is `application/json`

### Timeout Errors

- Default timeout is 30 seconds (configurable in `config.js`)
- If your model takes longer, increase `REQUEST_TIMEOUT`
- Consider adding a loading indicator for long-running predictions

## 🔍 Debug Mode

Enable debug mode in `config.js` to see detailed console logs:

```javascript
DEBUG: true;
```

This will log:

- Request URL and payload
- Response data
- Any errors during the process

## 📝 Customization

### Validation Rules

Adjust validation ranges in `/src/config.js`:

```javascript
VALIDATION: {
  AGE_MIN: 1,
  AGE_MAX: 120,
  CA_MIN: 0,
  CA_MAX: 4,
  // ... other validations
}
```

### Display Settings

Configure display behavior:

```javascript
DISPLAY: {
  SCROLL_TO_RESULTS: true,        // Auto-scroll to results
  AUTO_FOCUS_ERROR: true,          // Focus on error field
  SHOW_INPUT_SUMMARY: true         // Show input summary in results
}
```

## 🚀 Production Deployment

Before deploying to production:

1. Update `API_ENDPOINT` to your production API URL
2. Set `DEBUG: false` in config
3. Build the project: `npm run build`
4. Deploy the `dist` folder to your hosting service
5. Ensure your backend supports HTTPS for security

## 📞 Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check the network tab to see the request/response
3. Verify your API is working with a tool like Postman
4. Review the backend logs for any errors

## 🔒 Security Notes

- Never expose API keys in the frontend code
- Always use HTTPS in production
- Implement rate limiting on your backend
- Validate and sanitize all inputs on the backend
- This tool is for educational purposes - not a replacement for medical diagnosis
