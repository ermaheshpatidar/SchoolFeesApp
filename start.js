// Simple script to start the Expo application
const { execSync } = require('child_process');
const os = require('os');

console.log('\n=== School Fees Management App Starter ===\n');
console.log('Starting Expo development server...');
console.log('Use Expo Go app on your mobile device to scan the QR code that will appear');
console.log('Or press:');
console.log('  • a - to run on Android emulator (if installed)');
console.log('  • i - to run on iOS simulator (if installed)');
console.log('  • w - to run in web browser\n');

try {
  // Start the Expo development server
  execSync('npx expo start', { stdio: 'inherit' });
} catch (error) {
  console.error('\nFailed to start Expo development server:');
  console.error(error.message);
  console.error('\nPlease make sure Expo CLI is installed. If not, run:');
  console.error('npm install -g expo-cli');
  process.exit(1);
} 