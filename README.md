# Phishing URL Detector

A machine learning-based system to detect potentially malicious or phishing URLs. This repository contains two implementations of the same core functionality.

## 📁 Repository Structure

### `/python-version/`
Standalone Python implementation using scikit-learn and natural language processing techniques.

**Features:**
- Command-line interface
- Machine learning model training
- Batch URL analysis
- CSV export capabilities

### `/chrome-extension/`
Browser extension implementation with the same detection logic optimized for real-time web browsing.

**Features:**
- Real-time URL checking
- Browser popup interface
- Context menu integration
- Automatic suspicious page detection

## 🚀 Quick Start

### Python Version
```bash
cd python-version/
pip install -r requirements.txt
python main.py
```

### Chrome Extension
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked → select `chrome-extension` folder
4. Click the extension icon to start using

## 📖 Detailed Instructions

- **Python Version**: See [`/python-version/README.md`](./python-version/README.md)
- **Chrome Extension**: See [`/chrome-extension/README.md`](./chrome-extension/README.md)

## 🔍 How It Works

Both implementations use similar detection methods:
1. **URL Tokenization** - Breaking URLs into meaningful components
2. **Pattern Recognition** - Identifying suspicious keywords and structures
3. **Scoring Algorithm** - Calculating risk based on multiple factors
4. **Classification** - Determining if URL is safe or potentially malicious

## 🛠️ Technologies Used

**Python Version:**
- Python 3.x
- scikit-learn
- pandas
- nltk
- Regular expressions

**Chrome Extension:**
- JavaScript (ES6+)
- Chrome Extension APIs
- HTML5/CSS3
- Manifest V3

## 📊 Performance

Both versions achieve similar accuracy rates in detecting common phishing patterns including:
- Domain spoofing attempts
- Suspicious URL structures  
- Known malicious keywords
- Insecure login forms

## 🤝 Contributing

Feel free to contribute to either version:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

If you encounter any issues:
- Check the respective README files for troubleshooting
- Open an issue on GitHub
- Provide details about your system and the problem
