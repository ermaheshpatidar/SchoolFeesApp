import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { CommonActions } from '@react-navigation/native';

// Mock data for dashboard
const dashboardData = {
  totalFees: '₹15,75,000',
  collectedFees: '₹12,45,000',
  pendingFees: '₹3,30,000',
  defaulterCount: 42,
  busFeeCollection: '₹2,50,000',
  studentCount: 850,
  monthlyCollectionData: [
    { month: 'Apr', amount: 320000 },
    { month: 'May', amount: 280000 },
    { month: 'Jun', amount: 290000 },
    { month: 'Jul', amount: 305000 },
    { month: 'Aug', amount: 350000 },
    { month: 'Sep', amount: 200000 },
  ],
  collectionByCategory: [
    { name: 'Tuition', amount: 965000, color: '#3f51b5' },
    { name: 'Bus', amount: 250000, color: '#ff9800' },
    { name: 'Library', amount: 10000, color: '#4caf50' },
    { name: 'Sports', amount: 15000, color: '#f44336' },
    { name: 'Exam', amount: 5000, color: '#9c27b0' },
  ],
  defaultersByClass: [
    { class: 'Class 1', count: 5 },
    { class: 'Class 2', count: 3 },
    { class: 'Class 3', count: 4 },
    { class: 'Class 4', count: 2 },
    { class: 'Class 5', count: 6 },
    { class: 'Class 6', count: 7 },
    { class: 'Class 7', count: 3 },
    { class: 'Class 8', count: 4 },
    { class: 'Class 9', count: 3 },
    { class: 'Class 10', count: 5 },
  ],
  recentActivity: [
    { id: 1, type: 'payment', student: 'Rahul Kumar', amount: 5500, date: '2023-09-05', class: '10-A' },
    { id: 2, type: 'payment', student: 'Priya Sharma', amount: 6000, date: '2023-09-05', class: '11-B' },
    { id: 3, type: 'refund', student: 'Arjun Singh', amount: 1200, date: '2023-09-04', class: '12-A' },
    { id: 4, type: 'payment', student: 'Neha Patel', amount: 5500, date: '2023-09-04', class: '10-B' },
    { id: 5, type: 'payment', student: 'Vikram Desai', amount: 3800, date: '2023-09-03', class: '9-C' },
  ],
};

// Mock notifications
const notifications = [
  {
    id: '1',
    title: 'Fee Due',
    message: '15 students have fees due for this month',
    time: '2 hours ago',
    type: 'warning',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Rahul Kumar paid ₹5,500 for Term 2 fees',
    time: '4 hours ago',
    type: 'success',
  },
  {
    id: '3',
    title: 'Bus Fee Pending',
    message: '8 students have pending bus fees',
    time: '1 day ago',
    type: 'warning',
  },
  {
    id: '4',
    title: 'Defaulter Alert',
    message: '3 students have not paid fees for more than 2 months',
    time: '2 days ago',
    type: 'error',
  },
];

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('2023-2024');
  const [isNavigating, setIsNavigating] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  // Add debug function to check navigation state
  const checkNavigationState = () => {
    try {
      const state = navigation.getState();
      Alert.alert(
        'Navigation State',
        `Current State: ${JSON.stringify(state, null, 2)}`,
        [{ text: 'OK' }],
        { cancelable: true }
      );
      console.log('Navigation state:', state);
    } catch (error) {
      console.error('Error getting navigation state:', error);
      Alert.alert('Navigation Error', 'Could not retrieve navigation state');
    }
  };
  
  // Safe navigation function to prevent multiple navigation attempts
  const navigateSafely = useCallback((routeName: string, params?: any) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    console.log(`Navigating to ${routeName} with params:`, params);
    
    try {
      // Use CommonActions for more direct navigation control
      navigation.dispatch(
        CommonActions.navigate({
          name: routeName,
          params,
        })
      );
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not navigate to the requested screen.');
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  }, [navigation, isNavigating]);
  
  // Reset navigation to a specific route
  const resetToRoute = useCallback((routeName: string, screenName?: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    console.log(`Reset navigation to ${routeName}, screen: ${screenName || 'N/A'}`);
    
    try {
      const routes = screenName 
        ? [{ name: routeName, params: { screen: screenName } }]
        : [{ name: routeName }];
        
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes,
        })
      );
    } catch (error) {
      console.error('Navigation reset error:', error);
      Alert.alert('Navigation Error', 'Could not reset navigation to the requested screen.');
    } finally {
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  }, [navigation, isNavigating]);
  
  // Define quick actions with improved navigation
  const quickActions = [
    {
      title: 'Search Student',
      icon: 'search-outline',
      onPress: () => {
        console.log('Attempting to navigate to Search');
        navigateSafely('Search', { entityType: 'student' });
      },
    },
    {
      title: 'Collect Fee',
      icon: 'cash-outline',
      onPress: () => {
        console.log('Attempting to navigate to FeeCollection');
        resetToRoute('MainDrawer', 'FeeCollection');
      },
    },
    {
      title: 'Fee Recovery',
      icon: 'notifications-outline',
      onPress: () => { 
        console.log('Attempting to navigate to FeeRecovery');
        resetToRoute('MainDrawer', 'FeeRecovery');
      },
    },
    {
      title: 'Reports',
      icon: 'document-text-outline',
      onPress: () => {
        console.log('Attempting to navigate to Reports');  
        resetToRoute('MainDrawer', 'Reports');
      },
    },
  ];

  // Monthly collection chart data
  const monthlyCollectionChartData = {
    labels: dashboardData.monthlyCollectionData.map(item => item.month),
    datasets: [
      {
        data: dashboardData.monthlyCollectionData.map(item => item.amount/1000), // Convert to thousands for cleaner display
      },
    ],
  };

  // Collection by category chart data
  const pieChartData = dashboardData.collectionByCategory.map(item => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Function to render notification item
  const renderNotificationItem = ({ item }) => {
    let iconName, iconColor;
    
    switch (item.type) {
      case 'success':
        iconName = 'checkmark-circle';
        iconColor = '#4cd964';
        break;
      case 'warning':
        iconName = 'alert-circle';
        iconColor = '#ff9500';
        break;
      case 'error':
        iconName = 'close-circle';
        iconColor = '#ff3b30';
        break;
      default:
        iconName = 'information-circle';
        iconColor = '#0066cc';
    }
    
    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationIcon}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  // Render recent activity item
  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: item.type === 'payment' ? '#4cd964' : '#ff9500' }]}>
        <Ionicons 
          name={item.type === 'payment' ? 'cash-outline' : 'return-down-back-outline'} 
          size={16} 
          color="#fff" 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {item.type === 'payment' ? 'Payment Received' : 'Refund Processed'}
        </Text>
        <Text style={styles.activityDetails}>
          {item.student} ({item.class}) - ₹{item.amount}
        </Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
    </View>
  );

  // Render defaulters by class
  const renderDefaulterItem = ({ item }) => (
    <View style={styles.defaulterGridItem}>
      <Text style={styles.defaulterGridClass}>{item.class}</Text>
      <View style={styles.defaulterGridCountContainer}>
        <Text style={styles.defaulterGridCount}>{item.count}</Text>
      </View>
    </View>
  );

  // Render quick actions with improved touch handling
  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { opacity: isNavigating ? 0.7 : 1 }]}
            onPress={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              if (!isNavigating) {
                action.onPress();
              }
            }}
            activeOpacity={0.7}
            disabled={isNavigating}
          >
            <Ionicons name={action.icon as any} size={24} color="#0066cc" />
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.schoolName}>School Fees Management</Text>
        </View>
        <View style={styles.academicYearContainer}>
          <Text style={styles.academicYearLabel}>Academic Year:</Text>
          <Text style={styles.academicYear}>{currentAcademicYear}</Text>
        </View>
      </View>

      {/* Dashboard Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'overview' && styles.activeTab]}
          onPress={() => setActiveSection('overview')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="home-outline" 
            size={18} 
            color={activeSection === 'overview' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeSection === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'feeCollection' && styles.activeTab]}
          onPress={() => setActiveSection('feeCollection')}
        >
          <Ionicons 
            name="cash-outline" 
            size={18} 
            color={activeSection === 'feeCollection' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeSection === 'feeCollection' && styles.activeTabText]}>
            Fee Collection
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'defaulters' && styles.activeTab]}
          onPress={() => setActiveSection('defaulters')}
        >
          <Ionicons 
            name="alert-circle-outline" 
            size={18} 
            color={activeSection === 'defaulters' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeSection === 'defaulters' && styles.activeTabText]}>
            Defaulters
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'activity' && styles.activeTab]}
          onPress={() => setActiveSection('activity')}
        >
          <Ionicons 
            name="time-outline" 
            size={18} 
            color={activeSection === 'activity' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeSection === 'activity' && styles.activeTabText]}>
            Recent Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Content */}
      <View style={styles.content}>
        {activeSection === 'overview' && (
          <>
            {/* Quick Metrics Summary */}
            <View style={styles.metricsContainer}>
              <Text style={styles.sectionTitle}>Fee Collection Summary</Text>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="people-outline" size={24} color="#0066cc" />
                  </View>
                  <View>
                    <Text style={styles.metricValue}>{dashboardData.studentCount}</Text>
                    <Text style={styles.metricLabel}>Students</Text>
                  </View>
                </View>
                
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="cash-outline" size={24} color="#0066cc" />
                  </View>
                  <View>
                    <Text style={styles.metricValue}>{dashboardData.totalFees}</Text>
                    <Text style={styles.metricLabel}>Total Fee</Text>
                  </View>
                </View>
                
                <View style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: '#e6f7ed' }]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4cd964" />
                  </View>
                  <View>
                    <Text style={[styles.metricValue, { color: '#4cd964' }]}>
                      {dashboardData.collectedFees}
                    </Text>
                    <Text style={styles.metricLabel}>Collected</Text>
                  </View>
                </View>
                
                <View style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: '#fff5eb' }]}>
                    <Ionicons name="hourglass-outline" size={24} color="#ff9500" />
                  </View>
                  <View>
                    <Text style={[styles.metricValue, { color: '#ff9500' }]}>
                      {dashboardData.pendingFees}
                    </Text>
                    <Text style={styles.metricLabel}>Pending</Text>
                  </View>
                </View>
                
                <View style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: '#ffebee' }]}>
                    <Ionicons name="alert-circle-outline" size={24} color="#ff3b30" />
                  </View>
                  <View>
                    <Text style={[styles.metricValue, { color: '#ff3b30' }]}>
                      {dashboardData.defaulterCount}
                    </Text>
                    <Text style={styles.metricLabel}>Defaulters</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Render Quick Actions with improved handling */}
            {renderQuickActions()}
          </>
        )}

        {activeSection === 'feeCollection' && (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Monthly Fee Collection (₹ '000)</Text>
              <BarChart
                data={monthlyCollectionChartData}
                width={screenWidth * 0.9}
                height={220}
                yAxisLabel="₹"
                yAxisSuffix="k"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.chart}
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Collection by Category</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth * 0.9}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
          </>
        )}

        {activeSection === 'defaulters' && (
          <>
            <View style={styles.defaultersContainer}>
              <Text style={styles.sectionTitle}>Fee Defaulters by Class</Text>
              <View style={styles.defaultersGridContainer}>
                <FlatList
                  data={dashboardData.defaultersByClass}
                  renderItem={renderDefaulterItem}
                  keyExtractor={(item) => item.class}
                  numColumns={3}
                  columnWrapperStyle={styles.defaultersGridRow}
                />
              </View>
            </View>

            <View style={styles.defaultersActionContainer}>
              <TouchableOpacity 
                style={[styles.defaultersActionButton, { opacity: isNavigating ? 0.7 : 1 }]}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  if (!isNavigating) {
                    console.log('Attempting to navigate to FeeRecovery from defaulters');
                    resetToRoute('MainDrawer', 'FeeRecovery');
                  }
                }}
                activeOpacity={0.7}
                disabled={isNavigating}
              >
                <Text style={styles.defaultersActionButtonText}>
                  View All Defaulters
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeSection === 'activity' && (
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Fee Transactions</Text>
            <FlatList
              data={dashboardData.recentActivity}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* Debug button */}
      {debugMode && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Tools</Text>
          <View style={styles.debugButtonsRow}>
            <TouchableOpacity 
              style={styles.debugButton}
              onPress={checkNavigationState}
              activeOpacity={0.7}
            >
              <Text style={styles.debugButtonText}>Check Navigation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.debugButton}
              onPress={() => {
                console.log('Manual navigation to FeeCollection');
                resetToRoute('MainDrawer', 'FeeCollection');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.debugButtonText}>Go to Fee Collection</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Help Card */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Contact the administrator for any queries related to fee payments or
            technical support.
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            activeOpacity={0.7}
            // Enable debug mode with long press
            onLongPress={() => setDebugMode(!debugMode)}
          >
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3f51b5',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  academicYearContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  academicYearLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  academicYear: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#3f51b5',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  metricsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricCard: {
    width: '20%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionCard: {
    width: '25%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  actionTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  notificationsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    fontSize: 14,
    color: '#3f51b5',
  },
  notificationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  notificationIcon: {
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#3f51b5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  defaultersContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  defaultersGridContainer: {
    marginBottom: 10,
  },
  defaultersGridRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  defaulterGridItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  defaulterGridClass: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  defaulterGridCountContainer: {
    backgroundColor: '#ff9800',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaulterGridCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  defaultersActionContainer: {
    marginBottom: 16,
  },
  defaultersActionButton: {
    backgroundColor: '#3f51b5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultersActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  debugContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  debugButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen; 