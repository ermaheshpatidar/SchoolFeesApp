import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import type { DashboardStats, FeePayment } from '../types';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCollectedToday: 0,
    totalPending: 0,
    totalStudents: 0,
    recentPayments: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.getDashboardStats();
      // setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today's Collection</Text>
          <Text style={styles.statValue}>
            {formatCurrency(stats.totalCollectedToday)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pending</Text>
          <Text style={[styles.statValue, styles.pendingAmount]}>
            {formatCurrency(stats.totalPending)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Students</Text>
          <Text style={styles.statValue}>{stats.totalStudents}</Text>
        </View>
      </View>

      <View style={styles.recentPaymentsContainer}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        {stats.recentPayments.map((payment: FeePayment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentType}>{payment.feeType}</Text>
              <Text style={styles.paymentDate}>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.paymentAmount}>
              <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
              <Text style={styles.receiptNumber}>
                Receipt: {payment.receiptNumber}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minWidth: '45%',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pendingAmount: {
    color: '#cc0000',
  },
  recentPaymentsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentDate: {
    color: '#666',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  receiptNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminDashboardScreen; 