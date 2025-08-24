# Changelog

## v2.0.0 - Centralized API Configuration & Individual Summaries

### 🎉 Major Changes

- **Centralized API Key Management**: API key is now managed in a single location (`popup/src/config/api.js`)
- **Individual AI Summaries**: Each highlight can now have its own AI summary instead of bulk summarization
- **Improved Architecture**: Added service layer for OpenAI API calls

### ✨ New Features

- Individual "Generate AI Summary" button for each highlight
- AI summaries displayed in blue boxes below highlights
- API key validation and configuration status
- Better error handling for API calls
- Summary count display in header

### 🔧 Technical Improvements

- **New Files**:
  - `popup/src/config/api.js` - Centralized API configuration
  - `popup/src/services/openai.js` - OpenAI API service layer
- **Updated Components**:
  - `HighlightItem.jsx` - Added individual summary functionality
  - `App.jsx` - Removed bulk summarization, added individual summary support
  - `storage.js` - Added `updateHighlight` function
- **Removed Dependencies**:
  - No more API key duplication across multiple files
  - Removed bulk summarization modal

### 🚀 Benefits

1. **Single Source of Truth**: Update API key in one place only
2. **Better UX**: Individual summaries are more useful than bulk summaries
3. **Improved Maintainability**: Centralized configuration and service layer
4. **Better Error Handling**: More informative error messages
5. **Cleaner Architecture**: Separation of concerns between config, services, and components

### 📝 Migration Guide

If upgrading from v1.x:

1. Move your API key from multiple files to `popup/src/config/api.js`
2. Run `./build.sh` to rebuild
3. Reload the extension in Chrome
4. Existing highlights will work, but you'll need to generate summaries individually

### 🔄 API Key Update Process

**Old Process** (v1.x):

1. Update API key in 3 different files
2. Clean build files manually
3. Rebuild and reload

**New Process** (v2.0+):

1. Update API key in `popup/src/config/api.js` only
2. Run `./build.sh`
3. Reload extension

Much simpler and less error-prone!
