# Fake/Phishing Website Detection

## Overview
This project develops a machine learning model to detect phishing and fake websites from their URLs. Using natural language processing techniques and logistic regression, the model classifies URLs as either legitimate ("good") or malicious ("bad").

---

## 1. Reasoning & Methodology

### Why Logistic Regression?
Logistic Regression was chosen for this classification task due to several compelling reasons:

- **Interpretability**: The model provides clear decision boundaries and coefficients that indicate which URL features are most predictive of phishing attacks
- **Computational Efficiency**: With a dataset of ~312,844 URLs and high-dimensional TF-IDF vectors, logistic regression trains quickly without excessive computational overhead
- **Probabilistic Output**: Unlike hard classifiers, logistic regression provides probability scores, allowing for threshold tuning based on business priorities
- **Baseline Establishment**: This serves as a strong baseline model; more complex models (Random Forest, Neural Networks) can be evaluated against it
- **Production Readiness**: Its simplicity makes it easier to deploy, monitor, and maintain in production environments

### Feature Engineering Process
1. **Tokenization**: URLs are tokenized to extract meaningful words using `RegexpTokenizer` (capturing alphabetic characters only)
2. **Stemming**: Applied `SnowballStemmer` to reduce words to their root forms, handling variations like "phishing", "phished", "phish"
3. **TF-IDF Vectorization**: Converted text features into numerical vectors using `TfidfVectorizer`, which:
   - Captures the importance of terms within each URL
   - Reduces the weight of common words
   - Normalizes vector lengths for fair comparison

---

## 2. Exploratory Data Analysis (EDA)

### Dataset Composition
- **Total Records**: 312,844 URLs (after balancing)
- **Original Imbalance**: 
  - Good URLs: 645,933
  - Bad URLs: 156,422
  - **Imbalance Ratio**: 4.1:1 (81.4% good, 18.6% bad)

### Data Balancing Decision
**Critical Finding**: The original dataset was highly imbalanced, with 81.4% legitimate URLs and only 18.6% phishing URLs. This is a realistic representation of real-world scenarios, but posed a challenge for model training.

**Action Taken**: The "good" class was downsampled from 645,933 to 156,422 samples to create a balanced 50-50 dataset. 

**Trade-offs**:
- ✅ **Advantage**: Prevents the model from learning a trivial classifier that always predicts "good"
- ✅ **Advantage**: Enables balanced precision/recall trade-offs
- ❌ **Disadvantage**: Loss of information about the true prevalence of legitimate vs. phishing sites
- ❌ **Disadvantage**: In production, a balanced threshold (0.5) will not reflect real-world probabilities

**Recommendation**: In a production system, model predictions should be re-calibrated using the original class proportions (81.4% good, 18.6% bad) for more realistic probability estimates.

### Data Characteristics
- **No Missing Values**: Dataset is clean with no null values
- **Feature Diversity**: TF-IDF features capture 1000+ unique terms from URLs
- **Balanced Train-Test Split**: Used stratified 80-20 split to maintain class balance across splits

---

## 3. Model Performance & Evaluation

### Accuracy Metrics
- **Training Accuracy**: ~95-96%
- **Testing Accuracy**: ~94-95%

### Why Accuracy Alone Is Insufficient

⚠️ **Critical Issue with Imbalanced Data**: Even though we balanced the training data, accuracy does not tell the full story:

- A naive classifier predicting all URLs as "good" would achieve 50% accuracy (after balancing)
- Accuracy doesn't differentiate between different types of errors:
  - **False Positives (FP)**: Flagging a legitimate site as phishing
  - **False Negatives (FN)**: Failing to detect an actual phishing site

### Precision vs. Recall Trade-off

For phishing detection, the choice between precision and recall depends on business objectives:

#### **Precision** (Focus on Minimizing False Positives)
Formula: Precision = TP / (TP + FP)

**When to Prioritize**: 
- User experience is critical
- False alarms frustrate legitimate users and block valid websites
- Example: A browser warning system that blocks too many safe sites drives users to disable warnings

**Impact**: Higher precision means fewer false alarms but might miss some real threats

#### **Recall** (Focus on Minimizing False Negatives)
Formula: Recall = TP / (TP + FN)

**When to Prioritize**:
- Security is paramount
- Phishing attacks cause severe damage (credential theft, financial loss, malware)
- Example: A security-first organization willing to block some legitimate sites to catch threats

**Impact**: Higher recall catches more phishing sites but may block legitimate ones

### Recommended Approach for This Project
**RECOMMENDATION: Optimize for Recall with a Precision Threshold**

**Reasoning**:
- Phishing attacks cause significant harm (identity theft, financial fraud, malware distribution)
- The cost of a missed phishing site (False Negative) >> cost of blocking a legitimate site (False Positive)
- Target: 90%+ recall (catch 90%+ of phishing) with ~85-90% precision
- Use `classification_report` and `confusion_matrix` to evaluate both metrics

**Implementation**:
```python
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_curve
print(classification_report(Y_test, predictions))
print(confusion_matrix(Y_test, predictions))
```

---

## 4. Business Impact

### Value Proposition
1. **Risk Mitigation**: Prevents users from visiting phishing sites that could steal credentials, install malware, or facilitate financial fraud
2. **User Trust**: Increases confidence in platform security, reducing churn and improving retention
3. **Cost Avoidance**: Blocks phishing attacks before they reach users, avoiding:
   - Data breach costs (averaging $3.86M per incident per IBM)
   - Legal/compliance penalties
   - Reputational damage

### Deployment Scenarios
1. **Email/Messaging Filters**: Flag URLs in emails before users click them
2. **Browser Extensions**: Real-time URL classification as users navigate
3. **Security Monitoring**: Scan suspicious URLs in logs for incident response
4. **Admin Dashboards**: Alert security teams to phishing campaign patterns

### Business Constraints & Decisions
- **Processing Speed**: With TF-IDF vectorization, predictions on a single URL take milliseconds—suitable for real-time use
- **Maintenance Burden**: Model drift over time as phishing tactics evolve; monthly retraining recommended
- **False Positive Cost**: If this blocks legitimate email domains, consider escalating to manual review rather than hard blocks
- **Threshold Optimization**: Instead of the default 0.5, calibrate to achieve desired precision-recall balance

---

## 5. Error Analysis & Model Limitations

### Sources of Error

**Type 1: False Positives (Legitimate URLs Flagged as Phishing)**
- **Cause**: Similar URL patterns to phishing sites (e.g., misspellings of popular domains)
- **Example**: "gogle.com" vs. "google.com"
- **Impact**: Frustrates legitimate users, reduces platform usability
- **Solution**: Implement feedback loop to relabel incorrectly blocked sites

**Type 2: False Negatives (Phishing Sites Not Detected)**
- **Cause**: Obfuscation techniques using IP addresses, punycode domains, or legitimate-looking subdomains
- **Example**: `https://192.168.1.1` or `xn--` (punycode encoded domains)
- **Impact**: Users fall victim to phishing; most costly type of error
- **Solution**: Add additional features (URL structure analysis, domain age, SSL certificate validation)

### Model Limitations

1. **URL-Only Analysis**: Current model relies only on URL text patterns
   - **Missing Context**: Doesn't analyze page content, SSL certificates, domain registration metadata, or DNS records
   - **Improvement**: Integrate WHOIS data, SSL certificate issuer validation, domain age analysis

2. **Evolving Threat Landscape**: Phishing tactics change rapidly
   - **Challenge**: Model trained on historical data may not catch emerging attack patterns
   - **Mitigation**: Implement monthly retraining pipeline with new phishing samples

3. **Language Bias**: TF-IDF vectorization assumes URLs contain meaningful English-like tokens
   - **Challenge**: Obfuscated URLs (random characters, base64 encoding) may not be well-represented
   - **Improvement**: Hybrid approach combining URL entropy analysis, domain reputation checks

4. **Class Distribution Mismatch**: Original data is imbalanced (81% legitimate); balanced training doesn't match real-world deployment
   - **Risk**: Model calibration may be off; probability outputs should be re-scaled before production use
   - **Fix**: Apply `CalibratedClassifierCV` to adjust probability outputs to real-world distribution

---

## 6. Why Trust This Model?

### Strengths ✅
1. **High Accuracy**: 94-95% test accuracy with consistent training/test performance indicates good generalization
2. **No Overfitting**: Training and testing accuracy are similar, suggesting the model learns generalizable patterns
3. **Stratified Validation**: Used stratified train-test split, ensuring both sets maintain class balance
4. **Interpretable Features**: TF-IDF provides clear, human-interpretable features (common words in phishing URLs)
5. **Fast Inference**: Predictions run in milliseconds, suitable for production scale
6. **Deterministic & Reproducible**: Logistic regression is deterministic; same input always produces same output

### Caveats & Cautions ⚠️
1. **Imbalance Handling**: Dataset was artificially balanced; real-world deployment will encounter ~81% legitimate URLs
2. **Incomplete Feature Set**: Only analyzes URL text; misses content, SSL, domain reputation signals
3. **Requires Retraining**: Phishing patterns evolve; model accuracy will degrade over time without retraining
4. **Threshold Dependency**: Default 0.5 threshold may not be optimal; should be tuned to business priorities
5. **No Confidence Intervals**: Model doesn't quantify uncertainty; adding calibration/confidence scoring is recommended

---

## 7. Recommendations for Production Deployment

### Immediate Improvements (Phase 1)
- [ ] Add `precision_recall_curve()` analysis to find optimal decision threshold
- [ ] Implement `confusion_matrix` visualization to understand error types
- [ ] Add model calibration using `CalibratedClassifierCV` for accurate probability estimates
- [ ] Set up monitoring dashboard to track real-world performance metrics (false positive/negative rates)

### Medium-term Enhancements (Phase 2)
- [ ] Integrate additional URL features: domain age, WHOIS registration, DNS reputation
- [ ] Add SSL certificate validation and issuer reputation checks
- [ ] Implement ensemble methods (Random Forest, Gradient Boosting) to compare with logistic regression
- [ ] Create feedback loop for manual review of borderline cases (0.4-0.6 probability range)

### Long-term Strategy (Phase 3)
- [ ] Move to multi-modal model combining URL, content, and network signals
- [ ] Implement active learning to efficiently label newly discovered phishing samples
- [ ] Deploy real-time retraining pipeline to adapt to emerging phishing tactics
- [ ] Consider adversarial testing to understand model robustness to obfuscated URLs

---

## 8. Key Conclusions

1. **Model Choice is Appropriate**: Logistic regression provides a good balance of interpretability, speed, and accuracy for initial phishing detection

2. **Imbalance Matters**: The original dataset's 81%-19% imbalance is realistic but was addressed through balancing. For production, re-calibration is essential

3. **Accuracy Isn't Enough**: Precision and recall must be evaluated separately. Given the high cost of missed phishing (false negatives), optimize for recall (~90%+) while maintaining acceptable precision

4. **This Is a Starting Point**: The model captures basic phishing patterns but needs additional features (domain metadata, content analysis) for production-grade detection

5. **Maintenance Required**: Monthly retraining and performance monitoring are essential to maintain effectiveness as phishing tactics evolve

6. **Business-Aligned Decisions**: The choice of evaluation metrics, threshold, and acceptable error rates should be driven by business priorities (user experience vs. security), not just statistical metrics

---

## Project Structure

```
phishing_detection/
├── README.md                          # This file
├── phishing_site_urls.csv             # Dataset (312,844 URLs)
├── phishing_detection.ipynb           # Jupyter notebook with full analysis
├── model.pickle                       # Trained logistic regression model
└── preprocessing_pipeline.py          # Tokenization, stemming, TF-IDF vectorization
```

## Dataset Source
- **File**: `phishing_site_urls.csv`
- **Features**: 
  - `URL`: Website URL
  - `Label`: Classification ("good" or "bad")
- **Sample Size**: 312,844 records (balanced)

## Technologies Used
- **Python 3.x**
- **Libraries**: pandas, scikit-learn, nltk, numpy, matplotlib
- **Algorithm**: Logistic Regression
- **Vectorization**: TF-IDF (Term Frequency-Inverse Document Frequency)
- **NLP Preprocessing**: Tokenization, Stemming (Snowball)

---

## Conclusion

This phishing detection model demonstrates solid initial performance (94-95% accuracy) on URL classification. However, production deployment requires:
- **Careful metric selection** (precision/recall) aligned with business objectives
- **Threshold tuning** beyond the default 0.5
- **Continuous monitoring** and retraining as phishing tactics evolve
- **Integration with additional signals** (domain metadata, content analysis) for defense-in-depth

The high accuracy combined with clean data and interpretable features provides a trustworthy foundation for blocking phishing attacks, but ongoing refinement is essential for long-term effectiveness.

---

*Created: February 2026*
*Model: Logistic Regression | Dataset Size: 312,844 | Accuracy: 94-95%*
