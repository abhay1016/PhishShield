# Phishing URL Detector

A machine learning-based system to detect potentially malicious or phishing URLs. This project demonstrates the same core functionality implemented in two different ways: a Python machine learning model and a Chrome browser extension.

## Project Overview

This repository contains a comprehensive phishing detection system that analyzes URLs for potential security threats using pattern recognition and machine learning techniques. The system can identify suspicious domains, malicious URL structures, and common phishing indicators.

## Available Implementations

### Python Machine Learning Version
A complete machine learning solution with training data, model development, and batch processing capabilities.

**Features:**
- Machine learning model training with scikit-learn
- URL feature extraction and preprocessing
- Batch URL analysis and classification
- Performance metrics and model evaluation
- CSV data processing and export
- Command-line interface

**Files:** All Python scripts, datasets, and machine learning models in the repository root

### Chrome Extension Version  
A real-time browser extension that brings the same detection logic directly to your web browsing experience.

**Features:**
- Real-time URL analysis while browsing
- Popup interface for manual URL checking
- Automatic suspicious page detection
- Context menu integration (right-click links)
- Warning overlays for malicious URLs
- No external API calls - all processing local

**Files:** Located in `/chrome-extension/` folder

## Quick Start

### For Python Version:
```bash
# Install dependencies
pip install -r requirements.txt

# Run the main script
python main.py

# Or train your own model
python train_model.py
```

### For Chrome Extension:
1. Download this repository as ZIP and extract
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the `chrome-extension` folder
5. Click the extension icon to start using

## How It Works

Both implementations use similar core algorithms:

1. 🔤 **URL Tokenization** - Breaks URLs into meaningful components
2. 🔧 **Text Processing** - Applies stemming and normalization
3. 🔍 **Pattern Analysis** - Identifies suspicious keywords and structures  
4. 📊 **Scoring System** - Calculates risk based on multiple indicators
5. ✅ **Classification** - Determines if URL is legitimate or potentially malicious

**🎯 Detection Capabilities:**
- 🎭 Domain spoofing (fake PayPal, Amazon, etc.)
- 🔗 Suspicious URL patterns and structures
- 🚨 Known phishing keywords and phrases
- 🔐 Insecure login form detection
- 📏 Long or obfuscated URLs

## ⚙️ Installation Instructions

### 🐍 Python Requirements:
- Python 3.7+
- pandas
- scikit-learn
- nltk
- numpy
- matplotlib (for visualizations)

### 🌐 Chrome Extension Requirements:
- Google Chrome browser
- Developer mode enabled
- No additional installations needed

## 📚 Usage Examples

### 🐍 Python Version:
```python
from url_detector import PhishingDetector

detector = PhishingDetector()
result = detector.predict_url("https://suspicious-website.com")
print(f"Prediction: {'Malicious' if result == 0 else 'Safe'}")
```

### 🌐 Chrome Extension:
- **🔍 Manual Check**: Click extension icon → enter URL → click "Check URL"
- **📄 Current Page**: Click extension icon → click "Check Current Page"  
- **🖱️ Right-click**: Right-click any link → "Check this URL for phishing"

## 📊 Dataset Information

The Python version includes training data with:
- ✅ Legitimate URLs from popular websites
- ⚠️ Known phishing URLs from security databases
- ⚖️ Balanced dataset for optimal model performance
- 🔧 Feature extraction from URL components

## 📈 Performance

- **🎯 Accuracy**: ~85-90% on test datasets
- **⚡ Speed**: Real-time analysis (< 100ms per URL)
- **❌ False Positives**: Minimized through careful pattern tuning
- **🛡️ Coverage**: Detects common phishing techniques and domain spoofing

## 👨‍💻 Development

### 🐍 Python Development:
```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Train new model
python train_model.py --data dataset.csv
```

### 🌐 Extension Development:
- 🚀 Built with Manifest V3
- 🔧 Uses modern Chrome Extension APIs
- 📦 No external dependencies
- 🔒 Local processing for privacy

## 🤝 Contributing

Contributions are welcome! Please:

1. 🍴 Fork the repository
2. 🌱 Create a feature branch (`git checkout -b feature/improvement`)
3. 💾 Commit your changes (`git commit -am 'Add new feature'`)
4. 📤 Push to the branch (`git push origin feature/improvement`)
5. 📝 Create a Pull Request

## 🔒 Security & Privacy

- **🚫 No data collection**: Neither implementation sends URLs to external servers
- **💻 Local processing**: All analysis performed locally on your machine/browser
- **🔓 Open source**: Complete transparency in detection methods
- **🕵️ No tracking**: Extension does not track browsing habits

## 🐛 Troubleshooting

### 🐍 Python Issues:
- 📦 Ensure all dependencies are installed: `pip install -r requirements.txt`
- 🐍 Check Python version compatibility (3.7+)
- 📁 Verify dataset files are present

### 🌐 Extension Issues:
- 🛠️ Enable Developer mode in Chrome
- 📁 Ensure you selected the `chrome-extension` folder (not individual files)
- 🚨 Check for errors in `chrome://extensions/` → Details → Errors
- 🔄 Refresh the extension after making changes

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- 🤖 Built using scikit-learn for machine learning components
- 🌐 Chrome Extension APIs for browser integration
- 🔧 Various open-source libraries and tools

## 📧 Contact

For questions, issues, or contributions, please open an issue on GitHub or contact the repository maintainer.
