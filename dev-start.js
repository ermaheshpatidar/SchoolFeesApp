const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('Creating assets directory...');
  fs.mkdirSync(assetsDir);
}

// Check if the placeholder assets exist, create if needed
const assetFiles = ['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'];
assetFiles.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder ${file}...`);
    // Copy a placeholder image or create an empty file
    fs.writeFileSync(filePath, '');
  }
});

console.log('\n🚀 Starting SchoolFeesApp development server with hot reload enabled...');
console.log('📱 Changes will automatically refresh in your browser\n');

// Run the dev script from package.json
const platform = process.argv[2] || 'web';
let scriptName;

switch (platform) {
  case 'android':
    scriptName = 'dev-android';
    break;
  case 'ios':
    scriptName = 'dev-ios';
    break;
  default:
    scriptName = 'dev';
    break;
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(npx, ['expo', 'start', '--web', '--port', '19000', '--hot'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit();
}); 