# Heart Disease Prediction System

A modern web application for heart disease risk prediction using machine learning. This application provides an intuitive interface for users to input their health data and receive AI-powered risk assessments.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A running backend API (see [API Integration Guide](./API_INTEGRATION.md))

### Installation

1. **Clone the repository**

   ```bash
   cd heart_scan
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the API endpoint**

   Open `src/config.js` and update the API endpoint:

   ```javascript
   API_ENDPOINT: "http://localhost:5000"; // Your API URL
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
heart_scan/
├── src/
│   ├── components/          # Reusable HTML components
│   │   ├── navbar.html
│   │   └── footer.html
│   ├── pages/
│   │   └── predict.html    # Main prediction form
│   ├── js/
│   │   ├── api.js          # API service layer
│   │   ├── predict.js      # Form handling & prediction logic
│   │   └── carousel.js     # Carousel functionality
│   ├── scss/               # Styles
│   │   ├── components/
│   │   ├── global/
│   │   ├── pages/
│   │   └── utils/
│   ├── img/                # Images and assets
│   ├── config.js           # Application configuration
│   └── main.js             # Main entry point
├── public/                 # Public static assets
├── index.html             # Landing page
├── API_INTEGRATION.md     # API integration documentation
├── example_backend.py     # Example backend implementation
└── package.json
```

## 🎯 Features

- **Interactive Form**: User-friendly interface for health data input
- **Real-time Validation**: Client-side validation with helpful error messages
- **API Integration**: Seamless connection to machine learning backend
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Results Display**: Clear visualization of prediction results
- **Print Support**: Print prediction results for records
- **Configurable**: Easy configuration through `config.js`

## 🔧 Configuration

All configuration is managed in `src/config.js`:

### API Settings

```javascript
API_ENDPOINT: 'http://localhost:5000',  // Backend API URL
REQUEST_TIMEOUT: 30000,                  // Request timeout (ms)
DEBUG: true,                             // Enable debug logging
```

### Validation Rules

```javascript
VALIDATION: {
  AGE_MIN: 1,
  AGE_MAX: 120,
  CA_MIN: 0,
  CA_MAX: 4,
  // ... more validation rules
}
```

### Display Options

```javascript
DISPLAY: {
  SCROLL_TO_RESULTS: true,     // Auto-scroll to results
  AUTO_FOCUS_ERROR: true,      // Focus on error fields
  SHOW_INPUT_SUMMARY: true     // Show input summary
}
```

## 📊 API Integration

The application expects your backend to accept the following POST request format:

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

And return:

```json
{
  "prediction": 1,
  "probability": 0.85
}
```

For detailed API integration instructions, see [API_INTEGRATION.md](./API_INTEGRATION.md).

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Features

1. **Form Fields**: Update `src/pages/predict.html` and the field mappings in `src/js/api.js`
2. **Validation**: Add rules in `src/config.js` and logic in `src/js/predict.js`
3. **Styling**: Edit SCSS files in `src/scss/`

## 🧪 Testing

### Test with Example Backend

1. Install Flask and requirements:

   ```bash
   pip install flask flask-cors
   ```

2. Run the example backend:

   ```bash
   python example_backend.py
   ```

3. Test the frontend:
   ```bash
   npm run dev
   ```

### Sample Test Data

| Field               | Value          |
| ------------------- | -------------- |
| Age                 | 63             |
| Sex                 | Male           |
| Chest Pain Type     | Typical Angina |
| Resting BP          | 145            |
| Cholesterol         | 233            |
| Fasting Blood Sugar | > 120 mg/dl    |
| Resting ECG         | Normal         |
| Max Heart Rate      | 150            |
| Exercise Angina     | No             |
| ST Depression       | 2.3            |
| Slope               | Downsloping    |
| Major Vessels       | 0              |
| Thalassemia         | Normal         |

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

### Deployment Checklist

- [ ] Update `API_ENDPOINT` in `src/config.js` to production URL
- [ ] Set `DEBUG: false` in `src/config.js`
- [ ] Build the project (`npm run build`)
- [ ] Deploy `dist/` folder to hosting service (Netlify, Vercel, etc.)
- [ ] Ensure backend API is accessible from production domain
- [ ] Configure CORS on backend for production domain
- [ ] Use HTTPS for both frontend and backend

### Hosting Options

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repo for auto-deployment
- **GitHub Pages**: Use `gh-pages` branch
- **AWS S3 + CloudFront**: For scalable hosting

## 🔒 Security Considerations

- ⚠️ Never store sensitive data in the frontend
- ⚠️ Always use HTTPS in production
- ⚠️ Implement rate limiting on the backend
- ⚠️ Validate all inputs on both client and server
- ⚠️ This tool is for educational purposes only - not medical diagnosis

## 📝 Medical Disclaimer

This application is designed for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions regarding medical conditions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:

1. Check [API_INTEGRATION.md](./API_INTEGRATION.md) for API-related issues
2. Review browser console for errors
3. Check network tab for request/response details
4. Verify backend is running and accessible

## 📚 Data Source

The prediction model is based on the UCI Heart Disease dataset:

- 4 databases: Cleveland, Hungary, Switzerland, and VA Long Beach
- 303 instances with 13 features
- Used for binary classification of heart disease presence

## 🙏 Acknowledgments

- UCI Machine Learning Repository for the Heart Disease dataset
- Contributors and maintainers
- Medical professionals who provided domain expertise

---

**Built with ❤️ for better heart health awareness**
