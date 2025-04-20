import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';

// Import the fixed navigators
import {
  createFixedNativeStackNavigator,
  createFixedDrawerNavigator
} from './NavigationTempFix';

// Screens
import LoginScreen from '../screens/LoginScreen';
// Import screens that actually exist in the project
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import BusExpenditureScreen from '../screens/BusExpenditureScreen';
import FeeCollectionScreen from '../screens/FeeCollectionScreen';
import FeeRecoveryScreen from '../screens/FeeRecoveryScreen';
import ReportsScreen from '../screens/ReportsScreen';

// Import screens that exist in the project
import StudentManagementScreen from '../screens/StudentManagementScreen'; // Student management screen exists
import AdminSettingsScreen from '../screens/AdminSettingsScreen'; // Admin settings exists
import StudentDetailsScreen from '../screens/StudentDetailsScreen'; // This exists now
import NotificationScreen from '../screens/NotificationScreen'; // This exists now
import ProfileScreen from '../screens/ProfileScreen'; // This exists now
import ClassesScreen from '../screens/ClassesScreen'; // Now exists

// Comment out screens that don't exist yet and need to be created
// import StudentListScreen from '../screens/StudentListScreen';
// import FeeStructureScreen from '../screens/FeeManagementScreen';

// Enable screens for better performance
enableScreens();

// Define types for navigation parameters
export type RootStackParamList = {
  Login: undefined;
  HomeStack: undefined;
  MainDrawer: { screen?: string };
  Search: { entityType: string };
  Receipt: { receiptId: string };
  StudentDetails: { studentId: string };
  Profile: undefined;
  Notifications: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  FeeCollection: undefined;
  FeeRecovery: undefined;
  Reports: undefined;
  BusExpenditure: undefined;
  Students: undefined;
  Classes: undefined; // Uncommented as screen now exists
  // FeeStructure: undefined; // Commented out as screen doesn't exist
  Settings: undefined;
  Profile: undefined;
};

export type FeeStackParamList = {
  FeeCollection: undefined;
  Receipt: { receiptId: string };
  StudentDetails: { studentId: string };
  // FeeStructure: undefined; // Commented out as screen doesn't exist
};

export type BusStackParamList = {
  BusExpenditure: undefined;
};

export type StudentStackParamList = {
  // StudentList: undefined; // Commented out as screen doesn't exist
  StudentDetails: { studentId: string };
  Classes: undefined; // Added as screen now exists
};

// Create fixed navigators with correct types
const RootStack = createFixedNativeStackNavigator<RootStackParamList>();
const Drawer = createFixedDrawerNavigator<DrawerParamList>();
const FeeStack = createFixedNativeStackNavigator<FeeStackParamList>();
const BusStack = createFixedNativeStackNavigator<BusStackParamList>();
const StudentStack = createFixedNativeStackNavigator<StudentStackParamList>();

// Custom drawer content
const CustomDrawerContent = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>St.Marry Champion School </Text>
        <Text style={styles.drawerSubtitle}>Fees Management System</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Ionicons name="home-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Dashboard</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('FeeCollection')}
        activeOpacity={0.7}
      >
        <Ionicons name="cash-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Fee Collection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('FeeRecovery')}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Fee Recovery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Students')}
        activeOpacity={0.7}
      >
        <Ionicons name="people-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Students</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Classes')}
        activeOpacity={0.7}
      >
        <Ionicons name="school-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Classes</Text>
      </TouchableOpacity>
      
      {/* Commented out as FeeStructureScreen doesn't exist yet
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('FeeStructure')}
        activeOpacity={0.7}
      >
        <Ionicons name="list-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Fee Structure</Text>
      </TouchableOpacity>
      */}
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Reports')}
        activeOpacity={0.7}
      >
        <Ionicons name="document-text-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Reports</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('BusExpenditure')}
        activeOpacity={0.7}
      >
        <Ionicons name="bus-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Bus Expenditure</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={24} color="#3f51b5" />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            // Add confirmation before logout
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { 
                  text: "Logout", 
                  onPress: () => navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  )
                }
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Fee Collection Stack Navigator
const FeeStackNavigator = () => {
  return (
    <FeeStack.Navigator
      id="fee-stack-navigator" // Add ID explicitly
      screenOptions={{
        headerShown: false,
      }}
    >
      <FeeStack.Screen name="FeeCollection" component={FeeCollectionScreen} />
      <FeeStack.Screen name="Receipt" component={ReceiptScreen} />
      <FeeStack.Screen name="StudentDetails" component={StudentDetailsScreen} />
      {/* Commented out as FeeStructureScreen doesn't exist yet
      <FeeStack.Screen name="FeeStructure" component={FeeStructureScreen} />
      */}
    </FeeStack.Navigator>
  );
};

// Bus Expenditure Stack Navigator
const BusStackNavigator = () => {
  return (
    <BusStack.Navigator
      id="bus-stack-navigator" // Add ID explicitly
      screenOptions={{
        headerShown: false,
      }}
    >
      <BusStack.Screen name="BusExpenditure" component={BusExpenditureScreen} />
    </BusStack.Navigator>
  );
};

// Student Management Stack Navigator
const StudentStackNavigator = () => {
  return (
    <StudentStack.Navigator
      id="student-stack-navigator"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Commented out as StudentListScreen doesn't exist yet
      <StudentStack.Screen name="StudentList" component={StudentListScreen} />
      */}
      <StudentStack.Screen name="StudentDetails" component={StudentDetailsScreen} />
      <StudentStack.Screen name="Classes" component={ClassesScreen} />
    </StudentStack.Navigator>
  );
};

// Main Drawer Navigator
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      id="main-drawer-navigator" // Add ID explicitly
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3f51b5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="FeeCollection" 
        component={FeeStackNavigator} 
        options={{
          title: 'Fee Collection',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="FeeRecovery" 
        component={FeeRecoveryScreen} 
        options={{
          title: 'Fee Recovery',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Students" 
        component={StudentStackNavigator} 
        options={{
          title: 'Students',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Classes" 
        component={ClassesScreen} 
        options={{
          title: 'Classes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Commented out as FeeStructureScreen doesn't exist yet
      <Drawer.Screen 
        name="FeeStructure" 
        component={FeeStructureScreen} 
        options={{
          title: 'Fee Structure',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      */}
      <Drawer.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{
          title: 'Reports',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="BusExpenditure" 
        component={BusStackNavigator} 
        options={{
          title: 'Bus Expenditure',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bus-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={AdminSettingsScreen} 
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Root App Navigator
const AppNavigator = () => {
  // Register navigation error listeners
  useEffect(() => {
    const handleNavigationStateChange = (state) => {
      console.log('Navigation state changed:', state);
    };
    
    return () => {
      // Clean up listener if needed
    };
  }, []);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        console.log('Navigation container state changed:', state);
      }}
      onReady={() => {
        console.log('Navigation container is ready');
      }}
      fallback={<Text>Loading...</Text>}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3f51b5" />
      <RootStack.Navigator 
        id="root-stack-navigator" // Add ID explicitly
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Disable gestures for better control
        }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="MainDrawer" component={MainDrawerNavigator} />
        <RootStack.Screen name="Search" component={SearchScreen} />
        <RootStack.Screen name="Receipt" component={ReceiptScreen} />
        <RootStack.Screen name="StudentDetails" component={StudentDetailsScreen} />
        <RootStack.Screen name="Profile" component={ProfileScreen} />
        <RootStack.Screen name="Notifications" component={NotificationScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#3f51b5',
    marginBottom: 10,
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  drawerFooter: {
    marginTop: 'auto',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppNavigator; 