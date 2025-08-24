#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Website Highlight Saver Chrome Extension...');

// Navigate to popup directory and install dependencies
process.chdir('popup');
console.log('📦 Installing popup dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
}

// Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}

// Build the React popup
console.log('⚡ Building React popup...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
}

// Navigate back to root
process.chdir('..');

// Remove existing popup build files
console.log('🗑️  Removing old build files...');
const filesToRemove = ['popup/index.html', 'popup/assets'];
filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
        fs.rmSync(file, { recursive: true, force: true });
    }
});

// Copy built files to popup directory
console.log('📁 Copying built files...');
const distPath = 'popup/dist';
const targetPath = 'popup';

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
    console.error('❌ Build failed - dist directory not found');
    console.error('   This usually means the Vite build failed.');
    process.exit(1);
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy all files from dist to popup root
try {
    fs.readdirSync(distPath).forEach(item => {
        const srcPath = path.join(distPath, item);
        const destPath = path.join(targetPath, item);
        copyRecursiveSync(srcPath, destPath);
    });
} catch (error) {
    console.error('❌ Failed to copy build files:', error.message);
    process.exit(1);
}

// Auto-generate index.html with correct asset paths
console.log('🔧 Generating index.html with correct asset paths...');

// Find the generated JS and CSS files
const assetsPath = 'popup/assets';
let jsFile = '';
let cssFile = '';

if (!fs.existsSync(assetsPath)) {
    console.error('❌ Assets directory not found');
    console.error('   Expected: popup/assets/');
    process.exit(1);
}

const files = fs.readdirSync(assetsPath);
console.log('📋 Found asset files:', files);

jsFile = files.find(file => file.startsWith('main-') && file.endsWith('.js'));
cssFile = files.find(file => file.startsWith('main-') && file.endsWith('.css'));

if (!jsFile) {
    console.error('❌ Could not find generated JS file (main-*.js)');
    console.error('   Available files:', files);
    process.exit(1);
}

if (!cssFile) {
    console.error('❌ Could not find generated CSS file (main-*.css)');
    console.error('   Available files:', files);
    process.exit(1);
}

// Create the index.html file with the correct asset paths
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Website Highlight Saver</title>
    <script type="module" crossorigin src="./assets/${jsFile}"></script>
    <link rel="stylesheet" crossorigin href="./assets/${cssFile}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

fs.writeFileSync('popup/index.html', indexHtml);

// Clean up dist folder
fs.rmSync(distPath, { recursive: true, force: true });

console.log('✅ Build complete! Extension files are ready.');
console.log('');
console.log('📋 Generated files:');
console.log(`   - popup/index.html (auto-generated with correct paths)`);
console.log(`   - assets/${jsFile}`);
console.log(`   - assets/${cssFile}`);
console.log('');
console.log('🔧 To install the extension:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable \'Developer mode\'');
console.log('3. Click \'Load unpacked\' and select this folder');
console.log('');
console.log('💡 Don\'t forget to replace \'YOUR_NEW_API_KEY_HERE\' in popup/src/config/api.js with your actual OpenAI API key!');