import React from 'react';
import {
  createDrawerNavigator as originalCreateDrawerNavigator,
  DrawerNavigationOptions,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  createNativeStackNavigator as originalCreateNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

// These wrapper functions add the 'id' prop that TypeScript is expecting
// but is not actually required at runtime

/**
 * Wrapper for createNativeStackNavigator to make TypeScript happy about the id property
 */
export function createFixedNativeStackNavigator<T extends Record<string, object | undefined>>(
) {
  const NativeStack = originalCreateNativeStackNavigator<T>();
  
  // Create wrapper component for Navigator that supplies id internally
  const FixedNavigator = (props: any) => {
    const navigatorProps = {
      ...props,
      id: props.id || 'stack-navigator' // Provide default id
    };
    
    return <NativeStack.Navigator {...navigatorProps} />;
  };
  
  return {
    ...NativeStack,
    Navigator: FixedNavigator,
  };
}

/**
 * Wrapper for createDrawerNavigator to make TypeScript happy about the id property
 */
export function createFixedDrawerNavigator<T extends Record<string, object | undefined>>(
) {
  const Drawer = originalCreateDrawerNavigator<T>();
  
  // Create wrapper component for Navigator that supplies id internally
  const FixedNavigator = (props: any) => {
    const navigatorProps = {
      ...props,
      id: props.id || 'drawer-navigator' // Provide default id
    };
    
    return <Drawer.Navigator {...navigatorProps} />;
  };
  
  return {
    ...Drawer,
    Navigator: FixedNavigator,
  };
}

// Helper function to wrap any navigator component with an ID to satisfy TypeScript
export function withNavigatorId(Navigator: React.ComponentType<any>, defaultId: string = 'navigator') {
  return (props: any) => {
    const fixedProps = {
      ...props,
      id: props.id || defaultId
    };
    return <Navigator {...fixedProps} />;
  };
} 