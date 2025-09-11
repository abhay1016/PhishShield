// Background script for the phishing detector extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('Phishing URL Detector extension installed');
});

// Listen for tab updates to potentially check URLs automatically
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Store the current URL for quick access
        chrome.storage.local.set({
            [`tab_${tabId}`]: tab.url
        });
    }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCurrentUrl') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                sendResponse({url: tabs[0].url});
            } else {
                sendResponse({error: 'No active tab found'});
            }
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'showNotification') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Phishing Detector',
            message: request.message
        });
    }
});

// Optional: Add context menu for right-click URL checking
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'checkUrl' && info.linkUrl) {
        // Send message to popup or content script to check the URL
        chrome.tabs.sendMessage(tab.id, {
            action: 'checkUrl',
            url: info.linkUrl
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'checkUrl',
        title: 'Check this URL for phishing',
        contexts: ['link']
    });
});