// Minimal content script - no console warnings or complex logic

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkUrl') {
        // Handle URL checking from context menu
        showUrlWarning(request.url);
    }
    
    if (request.action === 'getCurrentPageUrl') {
        sendResponse({url: window.location.href});
    }
});

// Function to show warning overlay on the page
function showUrlWarning(url) {
    // Create a simple overlay to show the result
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;
    
    overlay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">⚠️ Phishing Warning</div>
        <div>The URL "${url}" may be malicious. Exercise caution!</div>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            border: none;
            color: #ff4444;
            padding: 5px 10px;
            border-radius: 4px;
            margin-top: 10px;
            cursor: pointer;
            font-weight: bold;
        ">Close</button>
    `;
    
    if (document.body) {
        document.body.appendChild(overlay);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 10000);
    }
}