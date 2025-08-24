// Content script for detecting text selection and showing save popup
class HighlightSaver {
    constructor() {
        this.savePopup = null;
        this.selectedText = '';
        this.selectionRange = null;
        this.init();
    }

    init() {
        // Listen for text selection
        document.addEventListener('mouseup', this.handleTextSelection.bind(this));
        document.addEventListener('keyup', this.handleTextSelection.bind(this));

        // Hide popup when clicking elsewhere
        document.addEventListener('click', this.hidePopup.bind(this));

        // Load existing highlights and display them
        this.loadAndDisplayHighlights();
    }

    handleTextSelection(event) {
        // Small delay to ensure selection is complete
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText.length > 0) {
                this.selectedText = selectedText;
                this.selectionRange = selection.getRangeAt(0);
                this.showSavePopup(event);
            } else {
                this.hidePopup();
            }
        }, 10);
    }

    showSavePopup(event) {
        this.hidePopup(); // Remove existing popup

        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Create popup element
        this.savePopup = document.createElement('div');
        this.savePopup.className = 'highlight-save-popup';
        this.savePopup.innerHTML = `
      <div class="popup-content">
        <span class="popup-text">Save Highlight?</span>
        <button class="save-btn" id="saveHighlightBtn">Save</button>
        <button class="cancel-btn" id="cancelHighlightBtn">×</button>
      </div>
    `;

        // Position popup near selection
        this.savePopup.style.position = 'fixed';
        this.savePopup.style.left = `${rect.left + window.scrollX}px`;
        this.savePopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        this.savePopup.style.zIndex = '10000';

        document.body.appendChild(this.savePopup);

        // Add event listeners
        document.getElementById('saveHighlightBtn').addEventListener('click', this.saveHighlight.bind(this));
        document.getElementById('cancelHighlightBtn').addEventListener('click', this.hidePopup.bind(this));

        // Prevent popup from closing when clicking on it
        this.savePopup.addEventListener('click', (e) => e.stopPropagation());
    }

    hidePopup() {
        if (this.savePopup) {
            this.savePopup.remove();
            this.savePopup = null;
        }
    }

    async saveHighlight() {
        if (!this.selectedText) return;

        const highlight = {
            id: Date.now().toString(),
            text: this.selectedText,
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            domain: window.location.hostname
        };

        try {
            // Get existing highlights
            const result = await chrome.storage.local.get(['highlights']);
            const highlights = result.highlights || [];

            // Add new highlight
            highlights.unshift(highlight);

            // Save to storage
            await chrome.storage.local.set({ highlights });

            // Add visual highlight to page
            this.addVisualHighlight();

            // Show success feedback
            this.showSuccessMessage();

            // Send message to popup if it's open
            chrome.runtime.sendMessage({
                type: 'HIGHLIGHT_SAVED',
                highlight: highlight
            }).catch(() => {
                // Popup might not be open, ignore error
            });

        } catch (error) {
            console.error('Error saving highlight:', error);
        }

        this.hidePopup();
    }

    addVisualHighlight() {
        if (!this.selectionRange) return;

        try {
            // Create highlight span
            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'saved-highlight';
            highlightSpan.style.backgroundColor = '#ffeb3b';
            highlightSpan.style.padding = '2px';
            highlightSpan.style.borderRadius = '2px';

            // Wrap the selected text
            this.selectionRange.surroundContents(highlightSpan);

            // Clear selection
            window.getSelection().removeAllRanges();
        } catch (error) {
            // If surrounding fails (complex selection), just clear selection
            window.getSelection().removeAllRanges();
        }
    }

    showSuccessMessage() {
        const successMsg = document.createElement('div');
        successMsg.className = 'highlight-success-message';
        successMsg.textContent = 'Highlight saved!';
        successMsg.style.position = 'fixed';
        successMsg.style.top = '20px';
        successMsg.style.right = '20px';
        successMsg.style.zIndex = '10001';

        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.remove();
        }, 2000);
    }

    async loadAndDisplayHighlights() {
        try {
            const result = await chrome.storage.local.get(['highlights']);
            const highlights = result.highlights || [];

            // Find and highlight existing saved text on current page
            highlights.forEach(highlight => {
                if (highlight.url === window.location.href) {
                    this.highlightTextOnPage(highlight.text);
                }
            });
        } catch (error) {
            console.error('Error loading highlights:', error);
        }
    }

    highlightTextOnPage(text) {
        // Simple text highlighting - in production, you might want more sophisticated matching
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while (node = walker.nextNode()) {
            if (node.textContent.includes(text)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent && !parent.classList.contains('saved-highlight')) {
                const content = textNode.textContent;
                const index = content.indexOf(text);

                if (index !== -1) {
                    const beforeText = content.substring(0, index);
                    const highlightText = content.substring(index, index + text.length);
                    const afterText = content.substring(index + text.length);

                    const fragment = document.createDocumentFragment();

                    if (beforeText) {
                        fragment.appendChild(document.createTextNode(beforeText));
                    }

                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'saved-highlight';
                    highlightSpan.textContent = highlightText;
                    fragment.appendChild(highlightSpan);

                    if (afterText) {
                        fragment.appendChild(document.createTextNode(afterText));
                    }

                    parent.replaceChild(fragment, textNode);
                }
            }
        });
    }
}

// Initialize the highlight saver
new HighlightSaver();