// Navigation troubleshooting script
console.log('=== Navigation Troubleshooting Guide ===');
console.log('If you are experiencing navigation issues, try the following steps:');
console.log('\n1. Clear React Native cache:');
console.log('   npx react-native start --reset-cache');
console.log('\n2. Clear Expo cache:');
console.log('   expo r -c');
console.log('\n3. Check for pointerEvents warnings in the console.');
console.log('   If you see "props.pointerEvents is deprecated. Use style.pointerEvents", make sure all');
console.log('   TouchableOpacity components use style.pointerEvents instead of the direct prop.');
console.log('\n4. Restart your Expo development server:');
console.log('   Press Ctrl+C to stop the current server');
console.log('   Then run: npx expo start');
console.log('\n5. If you still have issues, try running the app in a different environment:');
console.log('   - For web: npx expo start --web');
console.log('   - For Android: npx expo start --android');
console.log('   - For iOS: npx expo start --ios');
console.log('\nRemember to check the console logs for navigation-related messages.');
console.log('We added console.log statements in navigation functions to help diagnose the issue.\n');

console.log('Running diagnostic checks...');

const fs = require('fs');
const path = require('path');

// Check if navigation files exist
const appNavigatorPath = path.join(__dirname, 'src', 'navigation', 'AppNavigator.tsx');
if (fs.existsSync(appNavigatorPath)) {
  console.log('✅ AppNavigator.tsx found');
} else {
  console.log('❌ AppNavigator.tsx not found - this could be causing navigation issues');
}

// Check if HomeScreen exists
const homeScreenPath = path.join(__dirname, 'src', 'screens', 'HomeScreen.tsx');
if (fs.existsSync(homeScreenPath)) {
  console.log('✅ HomeScreen.tsx found');
} else {
  console.log('❌ HomeScreen.tsx not found - this could be causing navigation issues');
}

console.log('\nTroubleshooting complete. If issues persist, please check the React Navigation documentation:');
console.log('https://reactnavigation.org/docs/troubleshooting/\n'); 