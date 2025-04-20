# School Fees App Navigation Troubleshooting Guide

## Resolving Navigation Issues

If you're experiencing issues with navigation in the School Fees App, follow these steps to resolve them:

### 1. Check for Console Errors

First, check the console for any error messages that might indicate what's wrong:

```bash
# Start the expo app with verbose logging
npx expo start --dev-client
```

Look for messages containing:
- "undefined is not an object"
- "Cannot read property 'navigate' of undefined"
- Navigation-related error messages

### 2. Use Debug Mode

We've added a debug mode to help diagnose navigation issues:

1. Go to the Home Screen
2. **Long press** the "Contact Support" button at the bottom
3. Debug buttons will appear
4. Use "Check Navigation" to view the current navigation state
5. Use "Go to Fee Collection" to test direct navigation

### 3. Clean Your Project

```bash
# Clear cache and reinstall dependencies
npm cache clean --force
rm -rf node_modules
npm install

# Clear expo cache
expo r -c
```

### 4. Fixed Common Issues

#### TouchableOpacity Event Handling

We've fixed issues with touch event handling:
- Added `activeOpacity={0.7}` to all TouchableOpacity components
- Using `e.stopPropagation()` to prevent event bubbling
- Added state tracking to prevent multiple navigation attempts

#### Navigation State Management

The fixes include:
- Using `CommonActions.navigate` and `CommonActions.reset` for more reliable navigation
- Implementing proper error handling for navigation actions
- Adding navigation state logging for debugging
- Fixing drawer navigation configuration

#### Component ID Properties

We fixed the 'id' property TypeScript errors using a custom NavigationTempFix.tsx file:
- Created wrapper functions for React Navigation components
- Added explicit ID properties to all navigator components
- Used `createFixedNativeStackNavigator` and `createFixedDrawerNavigator` instead of the standard ones

The fix is located in:
- `src/navigation/NavigationTempFix.tsx` - Contains wrapper components that add the required 'id' property
- `src/navigation/AppNavigator.tsx` - Uses the fixed navigators with explicit ID values

### 5. Package Dependencies

Make sure you have the correct navigation dependencies:

```bash
npm install @react-navigation/native-stack @react-navigation/drawer @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### 6. Still Having Issues?

If you continue to experience navigation problems:

1. Try using the CommonActions API directly:
   ```javascript
   navigation.dispatch(
     CommonActions.navigate({
       name: 'MainDrawer',
       params: { screen: 'FeeCollection' },
     })
   );
   ```

2. Check for version compatibility issues between React Navigation packages

3. Make sure all required navigation providers are correctly set up in your app

4. Contact support with the navigation state log from debug mode

### 7. Understanding the TypeScript Errors

If you encounter TypeScript errors related to the 'id' property for navigator components:

```
Property 'id' is missing in type '...' but required in type '{ id: undefined; }'
```

This is due to a mismatch between React Navigation's TypeScript types and the actual runtime behavior. Our solution:

1. We created wrapper components in `NavigationTempFix.tsx` that automatically add the required 'id' property
2. These wrappers are used instead of the standard navigator creators:
   - `createFixedNativeStackNavigator` instead of `createNativeStackNavigator`
   - `createFixedDrawerNavigator` instead of `createDrawerNavigator`
3. We also explicitly add 'id' properties to all navigator components 