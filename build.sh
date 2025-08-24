#!/bin/bash

# Build script for Website Highlight Saver Chrome Extension

echo "🚀 Building Website Highlight Saver Chrome Extension..."

# Navigate to popup directory and install dependencies
cd popup
echo "📦 Installing popup dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build the React popup
echo "⚡ Building React popup..."
npm run build

# Navigate back to root
cd ..

# Remove existing popup build files
echo "🗑️  Removing old build files..."
rm -rf popup/index.html popup/assets

# Copy built files to popup directory
echo "📁 Copying built files..."
cp -r popup/dist/* popup/

# Auto-generate index.html with correct asset paths
echo "🔧 Generating index.html with correct asset paths..."

# Find the generated JS and CSS files
JS_FILE=$(find popup/assets -name "main-*.js" -type f | head -1 | sed 's|popup/||')
CSS_FILE=$(find popup/assets -name "main-*.css" -type f | head -1 | sed 's|popup/||')

# Create the index.html file with the correct asset paths
cat > popup/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Website Highlight Saver</title>
    <script type="module" crossorigin src="./${JS_FILE}"></script>
    <link rel="stylesheet" crossorigin href="./${CSS_FILE}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

# Clean up dist folder
rm -rf popup/dist

echo "✅ Build complete! Extension files are ready."
echo ""
echo "📋 Generated files:"
echo "   - popup/index.html (auto-generated with correct paths)"
echo "   - ${JS_FILE}"
echo "   - ${CSS_FILE}"
echo ""
echo "🔧 To install the extension:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select this folder"
echo ""
echo "💡 Don't forget to replace 'YOUR_NEW_API_KEY_HERE' in popup/src/config/api.js with your actual OpenAI API key!"