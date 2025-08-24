#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Starting development mode...');
console.log('');
console.log('This will:');
console.log('1. Start the Vite dev server for hot reloading');
console.log('2. Watch for changes in your React components');
console.log('');
console.log('Note: You\'ll need to run "npm run build" to test in Chrome extension');
console.log('');

// Navigate to popup directory and start dev server
process.chdir('popup');

try {
    execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Development server failed to start');
    process.exit(1);
}