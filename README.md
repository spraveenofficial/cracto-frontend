# Website Highlight Saver Chrome Extension

A Chrome extension that allows users to save and manage text highlights from any webpage with AI-powered individual highlight summarization.

## Features

- **Text Selection**: Select any text on a webpage to save as a highlight
- **Floating Popup**: Convenient popup appears when text is selected
- **Persistent Storage**: Highlights are saved locally using Chrome's storage API
- **Visual Highlighting**: Selected text remains highlighted on the page
- **Individual AI Summaries**: Generate AI summaries for each highlight individually using OpenAI's GPT-3.5-turbo
- **Clean Interface**: Modern, responsive popup interface built with React and Tailwind CSS
- **Centralized API Configuration**: Single location for API key management

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

## Setup

Before using the AI summarization feature, you need to configure your OpenAI API key:

1. Open `popup/src/config/api.js`
2. Replace `'YOUR_NEW_API_KEY_HERE'` with your actual OpenAI API key
3. Run the build script: `./build.sh`
4. Reload the extension in Chrome

## Usage

1. **Save Highlights**: Select any text on a webpage and click "Save Highlight" in the popup
2. **View Highlights**: Click the extension icon to see all your saved highlights
3. **Generate Individual Summaries**: Click "Generate AI Summary" on any highlight to get an AI summary for that specific text
4. **View Summaries**: AI summaries appear in a blue box below each highlight
5. **Delete Highlights**: Click the delete button on individual highlights or "Clear All" to remove everything
6. **Visit Original Page**: Click "Visit page →" to return to where you found the highlight

## New Centralized API Configuration

The API key is now managed in a single location:

- **Configuration File**: `popup/src/config/api.js`
- **Centralized Service**: `popup/src/services/openai.js`
- **Single Update Point**: Change API key in one place only
- **Better Error Handling**: Improved API error messages and validation

## Technical Details

- **Manifest Version**: 3
- **Frontend**: React 18 with Tailwind CSS
- **Build Tool**: Vite
- **Storage**: Chrome Storage API
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **Architecture**: Centralized API configuration with service layer

## File Structure

```
├── manifest.json              # Extension configuration
├── contentScript.js           # Handles text selection and highlighting
├── content.css               # Styles for content script elements
├── background.js             # Service worker for extension
├── popup/                   # React popup application
│   ├── src/
│   │   ├── App.jsx          # Main popup component
│   │   ├── main.jsx         # React entry point
│   │   ├── config/
│   │   │   └── api.js       # Centralized API configuration
│   │   ├── services/
│   │   │   └── openai.js    # OpenAI API service
│   │   ├── components/      # React components
│   │   └── utils/           # Utility functions
│   └── dist/               # Built popup files
└── build.sh                # Build script
```

## Development

To modify the extension:

1. Make changes to the source files
2. Run `./build.sh` to rebuild
3. Reload the extension in Chrome
4. Test your changes

## API Key Management

### Updating Your API Key

1. Edit `popup/src/config/api.js`
2. Replace the `OPENAI_API_KEY` value
3. Run `./build.sh`
4. Reload the extension in Chrome

### API Configuration Options

You can customize the AI behavior in `popup/src/config/api.js`:

- `MODEL`: OpenAI model to use (default: 'gpt-3.5-turbo')
- `MAX_TOKENS`: Maximum response length (default: 150)
- `TEMPERATURE`: Response creativity (default: 0.7)

## API Key Security

⚠️ **Important**: This extension includes the API key in the built JavaScript files. For production use, consider implementing a more secure approach such as:

- Using a backend service to proxy API calls
- Implementing user-provided API keys with secure storage
- Using Chrome's identity API for OAuth flows

## License

MIT License - feel free to modify and distribute as needed.
