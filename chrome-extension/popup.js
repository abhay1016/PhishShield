// Simple tokenizer to match your Python implementation
function tokenizeURL(url) {
    // Remove protocol and www
    let cleanUrl = url.replace(/^https?:\/\/(www\.)?/i, '');
    
    // Extract only alphabetic characters (matching your RegexpTokenizer pattern)
    const tokens = cleanUrl.match(/[A-Za-z]+/g) || [];
    
    return tokens;
}

// Simple stemmer (basic version - you might want to use a proper stemming library)
function simpleStem(word) {
    // Basic stemming rules (simplified version)
    word = word.toLowerCase();
    
    // Common suffix removal
    if (word.endsWith('ing')) word = word.slice(0, -3);
    else if (word.endsWith('ed')) word = word.slice(0, -2);
    else if (word.endsWith('er')) word = word.slice(0, -2);
    else if (word.endsWith('est')) word = word.slice(0, -3);
    else if (word.endsWith('ly')) word = word.slice(0, -2);
    else if (word.endsWith('ion')) word = word.slice(0, -3);
    else if (word.endsWith('tion')) word = word.slice(0, -4);
    else if (word.endsWith('ness')) word = word.slice(0, -4);
    else if (word.endsWith('ment')) word = word.slice(0, -4);
    else if (word.endsWith('able')) word = word.slice(0, -4);
    else if (word.endsWith('ible')) word = word.slice(0, -4);
    else if (word.endsWith('ful')) word = word.slice(0, -3);
    else if (word.endsWith('less')) word = word.slice(0, -4);
    else if (word.endsWith('ous')) word = word.slice(0, -3);
    else if (word.endsWith('ive')) word = word.slice(0, -3);
    else if (word.endsWith('ary')) word = word.slice(0, -3);
    else if (word.endsWith('ory')) word = word.slice(0, -3);
    else if (word.endsWith('ify')) word = word.slice(0, -3);
    else if (word.endsWith('ize')) word = word.slice(0, -3);
    else if (word.endsWith('ise')) word = word.slice(0, -3);
    else if (word.endsWith('ies')) word = word.slice(0, -3) + 'y';
    else if (word.endsWith('ied')) word = word.slice(0, -3) + 'y';
    else if (word.endsWith('s') && word.length > 3) word = word.slice(0, -1);
    
    return word;
}

// Process URL similar to your Python pipeline
function processURL(url) {
    const tokens = tokenizeURL(url);
    const stemmed = tokens.map(token => simpleStem(token));
    return stemmed.join(' ');
}

// Simple classification based on common phishing patterns
function classifyURL(processedUrl) {
    const suspiciousPatterns = [
        'login', 'signin', 'account', 'secur', 'verif', 'updat', 'suspend',
        'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
        'bank', 'credit', 'card', 'password', 'confirm', 'click', 'urgent',
        'expire', 'limit', 'restrict', 'unlock', 'activ', 'deactiv'
    ];
    
    const legitimatePatterns = [
        'edu', 'gov', 'org', 'wikipedia', 'github', 'stackoverflow',
        'youtube', 'linkedin', 'twitter', 'instagram', 'reddit'
    ];
    
    let suspiciousScore = 0;
    let legitimateScore = 0;
    
    const words = processedUrl.split(' ');
    
    for (const word of words) {
        if (suspiciousPatterns.some(pattern => word.includes(pattern))) {
            suspiciousScore++;
        }
        if (legitimatePatterns.some(pattern => word.includes(pattern))) {
            legitimateScore++;
        }
    }
    
    // Additional checks for URL structure
    if (words.length > 10) suspiciousScore++; // Very long URLs
    if (words.some(word => word.length > 20)) suspiciousScore++; // Very long words
    if (words.filter(word => word.length < 3).length > 5) suspiciousScore++; // Many short fragments
    
    // Simple decision logic
    if (legitimateScore > suspiciousScore) return 1; // Good
    if (suspiciousScore > legitimateScore + 1) return 0; // Bad
    
    // Default to suspicious if uncertain and contains suspicious patterns
    return suspiciousScore > 0 ? 0 : 1;
}

function showResult(prediction, url) {
    const resultDiv = document.getElementById('result');
    
    if (prediction === 1) {
        resultDiv.className = 'result safe';
        resultDiv.innerHTML = '✅ This URL appears to be SAFE';
    } else {
        resultDiv.className = 'result danger';
        resultDiv.innerHTML = '⚠️ WARNING: This URL might be MALICIOUS<br><small>Please exercise caution when visiting this site</small>';
    }
    
    resultDiv.style.display = 'block';
}

function showLoading() {
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result loading';
    resultDiv.innerHTML = '<div class="spinner"></div>Analyzing URL...';
    resultDiv.style.display = 'block';
}

function hideResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const checkUrlBtn = document.getElementById('checkUrl');
    const checkCurrentBtn = document.getElementById('checkCurrent');
    const currentUrlDiv = document.getElementById('currentUrl');
    
    // Get current tab URL on popup open
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            const currentUrl = tabs[0].url;
            currentUrlDiv.textContent = `Current page: ${currentUrl}`;
        }
    });
    
    // Check manually entered URL
    checkUrlBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a URL to check');
            return;
        }
        
        showLoading();
        
        setTimeout(() => {
            try {
                const processedUrl = processURL(url);
                const prediction = classifyURL(processedUrl);
                showResult(prediction, url);
            } catch (error) {
                const resultDiv = document.getElementById('result');
                resultDiv.className = 'result danger';
                resultDiv.innerHTML = '❌ Error analyzing URL';
                resultDiv.style.display = 'block';
            }
        }, 1000); // Simulate processing time
    });
    
    // Check current page URL
    checkCurrentBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                const url = tabs[0].url;
                
                showLoading();
                
                setTimeout(() => {
                    try {
                        const processedUrl = processURL(url);
                        const prediction = classifyURL(processedUrl);
                        showResult(prediction, url);
                    } catch (error) {
                        const resultDiv = document.getElementById('result');
                        resultDiv.className = 'result danger';
                        resultDiv.innerHTML = '❌ Error analyzing URL';
                        resultDiv.style.display = 'block';
                    }
                }, 1000);
            }
        });
    });
    
    // Allow Enter key to trigger URL check
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkUrlBtn.click();
        }
    });
    
    // Hide result when typing new URL
    urlInput.addEventListener('input', hideResult);
});

// Handle messages from content script or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeUrl') {
        try {
            const processedUrl = processURL(request.url);
            const prediction = classifyURL(processedUrl);
            sendResponse({prediction: prediction, url: request.url});
        } catch (error) {
            sendResponse({error: 'Failed to analyze URL'});
        }
    }
});