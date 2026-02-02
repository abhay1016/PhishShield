# Fake / Phishing Website Detection

## Overview

This project develops a machine learning model to detect phishing and fake websites from their URLs. Using natural language processing techniques and Logistic Regression, the model classifies URLs as either legitimate ("good") or malicious ("bad").

---

## 1. Reasoning & Methodology

### Why Logistic Regression?

Logistic Regression was chosen for this classification task due to several compelling reasons:

- **Interpretability**: Clear decision boundaries and feature coefficients.
- **Computational Efficiency**: Trains fast on large TF-IDF feature spaces.
- **Probabilistic Output**: Supports threshold tuning.
- **Baseline Establishment**: Strong comparison baseline.
- **Production Readiness**: Easy to deploy and monitor.

---

### Feature Engineering Process

1. **Tokenization**: URLs tokenized using RegexpTokenizer.
2. **Stemming**: SnowballStemmer to normalize word forms.
3. **TF-IDF Vectorization**:
   - Captures term importance.
   - Reduces common-word weight.
   - Normalizes vector length.

---

## 2. Exploratory Data Analysis (EDA)
### Dataset Used https://drive.google.com/file/d/149xob7f64VL6Ln4w7RKZ0er4zzN3TDgT/view?usp=sharing
### Dataset Composition

- **Total Records**: 312,844 URLs (balanced)
- **Original Distribution**:
  - Good: 645,933  
  - Bad: 156,422  
  - Ratio: 4.1:1

### Balancing Decision

The dataset was highly imbalanced (81.4% legitimate).  
The majority class was downsampled to match the minority class.

**Trade-offs:**

- Prevents trivial majority-class prediction  
- Enables fair recall/precision evaluation  
- Loses real-world class proportion information  

---

## 3. Model Performance

- **Training Accuracy**: 95–96%  
- **Testing Accuracy**: 94–95%

### Why Accuracy Is Not Enough

- Accuracy hides false negatives.
- Phishing detection must consider **recall vs precision**.

### Metric Strategy

- **Recall** prioritized (missed phishing is costly)  
- Target: 90%+ recall with ~85% precision  

---

## 4. Business Impact

- Prevents credential theft & fraud  
- Improves user trust  
- Avoids security breach costs  

**Use Cases:**
- Email scanners  
- Browser extensions  
- Security dashboards  

---

## 5. Error Analysis

### False Positives
- Misspelled domains  
- Lookalike URLs  

### False Negatives
- IP-based URLs  
- Obfuscated domains  

**Improvement:** Add domain age, SSL, DNS reputation.

---

## 6. Why Trust This Model?

**Strengths**
- High accuracy  
- No overfitting  
- Fast inference  
- Interpretable  

**Limitations**
- URL-only features  
- Needs retraining  
- Balanced training ≠ real world  

---

## 7. Production Recommendations

- Threshold tuning  
- Calibration  
- Additional metadata features  
- Monitoring dashboard  

---

## Project Structure
```bash
PhishShield/
├── chrome-extension/              # Browser extension for real-time detection
├── Fake_website_detection.ipynb   # Model training & evaluation
├── README.md
```
