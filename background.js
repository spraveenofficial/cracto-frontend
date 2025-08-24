// Background script for message passing and coordination
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages between content script and popup
    if (message.type === 'HIGHLIGHT_SAVED') {
        // Broadcast to all extension contexts
        chrome.runtime.sendMessage(message).catch(() => {
            // Ignore errors if no listeners
        });
    }

    return true; // Keep message channel open for async responses
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Website Highlight Saver extension installed');
});