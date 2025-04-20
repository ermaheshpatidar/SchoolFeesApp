import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock notifications data
const notificationsMockData = [
  {
    id: '1',
    title: 'Fee Payment Reminder',
    message: 'The last date for paying the second quarter fees is 15th October 2023.',
    date: '2023-10-01T10:30:00',
    read: false,
    type: 'fee'
  },
  {
    id: '2',
    title: 'PTM Schedule',
    message: 'Parent-Teacher Meeting is scheduled for 20th October 2023 from 10:00 AM to 2:00 PM.',
    date: '2023-10-05T09:15:00',
    read: true,
    type: 'event'
  },
  {
    id: '3',
    title: 'Holiday Notice',
    message: 'The school will remain closed on 24th October 2023 due to Diwali celebrations.',
    date: '2023-10-10T14:20:00',
    read: false,
    type: 'holiday'
  },
  {
    id: '4',
    title: 'Fee Payment Confirmation',
    message: 'Payment of ₹15,000 received for Rahul Kumar (Class 10-A) for Second Quarter fees.',
    date: '2023-10-12T11:45:00',
    read: true,
    type: 'fee'
  },
  {
    id: '5',
    title: 'Bus Route Change',
    message: 'Bus route #3 will have a new stop at Sector 15 starting from 1st November 2023.',
    date: '2023-10-15T08:30:00',
    read: false,
    type: 'transport'
  },
  {
    id: '6',
    title: 'Fee Structure Update',
    message: 'The fee structure for the next academic year has been updated. Please check the fee details section.',
    date: '2023-10-20T16:10:00',
    read: false,
    type: 'fee'
  },
  {
    id: '7',
    title: 'System Maintenance',
    message: 'The fee payment portal will be under maintenance on 25th October from 10:00 PM to 2:00 AM.',
    date: '2023-10-22T09:00:00',
    read: true,
    type: 'system'
  },
];

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setNotifications(notificationsMockData);
      setLoading(false);
    }, 1000);
    
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Notifications',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTintColor: '#fff',
      headerRight: () => (
        <TouchableOpacity 
          style={{ paddingRight: 16 }}
          onPress={() => markAllAsRead()}
        >
          <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  const markAsRead = (id) => {
    setNotifications(prevNotifications => {
      return prevNotifications.map(notification => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      });
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => {
      return prevNotifications.map(notification => {
        return { ...notification, read: true };
      });
    });
  };
  
  const deleteNotification = (id) => {
    setNotifications(prevNotifications => {
      return prevNotifications.filter(notification => notification.id !== id);
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Today at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'fee':
        return <Ionicons name="cash-outline" size={24} color="#4caf50" />;
      case 'event':
        return <Ionicons name="calendar-outline" size={24} color="#2196f3" />;
      case 'holiday':
        return <Ionicons name="home-outline" size={24} color="#ff9800" />;
      case 'transport':
        return <Ionicons name="bus-outline" size={24} color="#9c27b0" />;
      case 'system':
        return <Ionicons name="settings-outline" size={24} color="#607d8b" />;
      default:
        return <Ionicons name="notifications-outline" size={24} color="#3f51b5" />;
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <View style={styles.actionContainer}>
          {!item.read && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => markAsRead(item.id)}
            >
              <Ionicons name="checkmark-outline" size={20} color="#3f51b5" />
              <Text style={styles.actionText}>Mark as read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => deleteNotification(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
            <Text style={[styles.actionText, { color: '#f44336' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color="#bdbdbd" />
      <Text style={styles.emptyText}>No notifications</Text>
      <Text style={styles.emptySubText}>You're all caught up!</Text>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loaderText}>Loading notifications...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={notifications.length === 0 && { flex: 1 }}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#3f51b5',
  },
  readNotification: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#3f51b5',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});

export default NotificationScreen; 